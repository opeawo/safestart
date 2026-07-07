import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import type { Lang } from "../i18n/strings";
import { t as tBase } from "../i18n/strings";
import { PLATFORMS, SETTINGS_PER_PLATFORM } from "../content/platforms";

export type PlatformProgress = {
  selected: boolean;
  currentStep: number;          // index into platform.steps
  done: boolean;
  skipped: boolean;
  completedSteps: number;       // how many "I did it" presses
};

type ProgressMap = Record<string, PlatformProgress>;

// localStorage is wrapped in try/catch: works on published *.pplx.app sites
// and standalone hosting; silently no-ops inside the sandboxed Perplexity
// preview iframe (where storage is blocked) so the app still runs there.
const STORAGE_KEY = "safestart.v1";

type Persisted = {
  lang: Lang | null;
  progress: ProgressMap;
  startedAt: number | null;
  schoolName: string | null;
};

function loadPersisted(): Partial<Persisted> | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function savePersisted(data: Persisted) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (e.g. iframe sandbox) — fall through silently.
  }
}

function clearPersisted() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type AppState = {
  lang: Lang | null;
  setLang: (l: Lang) => void;
  hasPickedLang: boolean;

  progress: ProgressMap;
  advanceStep: (id: string) => void;
  markDone: (id: string) => void;
  skipStep: (id: string) => void;
  skipPlatform: (id: string) => void;
  resetAll: () => void;

  // Session timer for celebration
  startedAt: number | null;
  startSession: () => void;

  // School attribution
  schoolName: string | null;
  setSchool: (n: string | null) => void;

  // Helpers
  totalSettings: number;
  completedPlatforms: string[];
  elapsedMinutes: number;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const Ctx = createContext<AppState | null>(null);

const initProgress = (): ProgressMap => {
  const m: ProgressMap = {};
  for (const p of PLATFORMS) {
    m[p.id] = { selected: true, currentStep: 0, done: false, skipped: false, completedSteps: 0 };
  }
  return m;
};

// Merge a saved progress map with the current platform list so newly added
// platforms (e.g. Chrome) get their default entry.
function mergeProgress(saved: ProgressMap | undefined): ProgressMap {
  const base = initProgress();
  if (!saved) return base;
  for (const id of Object.keys(base)) {
    if (saved[id]) base[id] = { ...base[id], ...saved[id] };
  }
  return base;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initial = loadPersisted();
  const [lang, setLangState] = useState<Lang | null>(initial?.lang ?? null);
  const [progress, setProgress] = useState<ProgressMap>(() =>
    mergeProgress(initial?.progress)
  );
  const [startedAt, setStartedAt] = useState<number | null>(initial?.startedAt ?? null);
  const [schoolName, setSchoolName] = useState<string | null>(initial?.schoolName ?? null);
  const [tick, setTick] = useState(0);

  // Persist whenever any tracked piece of state changes.
  useEffect(() => {
    savePersisted({ lang, progress, startedAt, schoolName });
  }, [lang, progress, startedAt, schoolName]);

  // Re-render every 30s so elapsedMinutes stays fresh on the celebration page.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const advanceStep = useCallback((id: string) => {
    setProgress((prev) => {
      const cur = prev[id];
      const platform = PLATFORMS.find((p) => p.id === id);
      if (!cur || !platform) return prev;
      const next = Math.min(cur.currentStep + 1, platform.steps.length);
      return {
        ...prev,
        [id]: { ...cur, currentStep: next, completedSteps: cur.completedSteps + 1 },
      };
    });
  }, []);

  const markDone = useCallback((id: string) => {
    setProgress((prev) => ({ ...prev, [id]: { ...prev[id], done: true } }));
  }, []);
  const skipStep = useCallback((id: string) => {
    setProgress((prev) => {
      const cur = prev[id];
      const platform = PLATFORMS.find((p) => p.id === id);
      if (!cur || !platform) return prev;
      return { ...prev, [id]: { ...cur, currentStep: Math.min(cur.currentStep + 1, platform.steps.length) } };
    });
  }, []);
  const skipPlatform = useCallback((id: string) => {
    setProgress((prev) => ({ ...prev, [id]: { ...prev[id], skipped: true, done: true } }));
  }, []);
  const resetAll = useCallback(() => {
    setProgress(initProgress());
    setStartedAt(null);
    setSchoolName(null);
    clearPersisted();
  }, []);
  const startSession = useCallback(() => {
    setStartedAt((s) => s ?? Date.now());
  }, []);

  const completedPlatforms = useMemo(
    () => PLATFORMS.filter((p) => progress[p.id]?.done && !progress[p.id]?.skipped).map((p) => p.id),
    [progress]
  );
  const totalSettings = useMemo(() => {
    let n = 0;
    for (const id of completedPlatforms) n += SETTINGS_PER_PLATFORM[id] ?? 4;
    return n;
  }, [completedPlatforms]);

  const elapsedMinutes = useMemo(() => {
    if (!startedAt) return 0;
    void tick;
    return Math.max(1, Math.round((Date.now() - startedAt) / 60_000));
  }, [startedAt, tick]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) =>
      tBase((lang ?? "en") as Lang, key, vars),
    [lang]
  );

  const value: AppState = {
    lang,
    setLang,
    hasPickedLang: lang !== null,
    progress,
    advanceStep,
    markDone,
    skipStep,
    skipPlatform,
    resetAll,
    startedAt,
    startSession,
    schoolName,
    setSchool: setSchoolName,
    totalSettings,
    completedPlatforms,
    elapsedMinutes,
    t,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside AppProvider");
  return v;
}
