import { useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { PLATFORMS } from "../content/platforms";
import { PlatformGlyph } from "../components/PlatformGlyph";

export default function PlatformSelect() {
  const { t, progress, startSession, completedPlatforms } = useApp();
  const [, navigate] = useLocation();

  const total = PLATFORMS.length;
  const doneCount = completedPlatforms.length;

  const launch = (id: string) => {
    startSession();
    navigate(`/walkthrough/${id}/intro`);
  };

  return (
    <Shell onBack={() => (history.length > 1 ? history.back() : navigate("/home"))}>
      <div
        className="text-[11px] uppercase font-extrabold tracking-widest mb-2"
        style={{ color: "rgb(var(--nav-text))" }}
      >
        {t("dashKicker")}
      </div>
      <h1
        className="font-display lowercase"
        style={{ color: "rgb(var(--green))", fontSize: 30, lineHeight: 1.05 }}
      >
        {t("dashTitle")}
      </h1>
      <p
        className="mt-3 text-[14px] leading-[1.55]"
        style={{ color: "rgb(var(--gray-light))" }}
      >
        {t("dashSub")}
      </p>

      <div
        className="mt-4 mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-extrabold"
        style={{
          color: "rgb(var(--green))",
          background: "rgba(88,204,2,0.12)",
        }}
        data-testid="text-dash-progress"
      >
        {t("dashProgress", { done: doneCount, total })}
      </div>

      <ul className="flex flex-col gap-3">
        {PLATFORMS.map((p) => {
          const prog = progress[p.id];
          const done = !!prog?.done;
          const totalSteps = p.steps.length;
          const currentStep = Math.min(prog?.currentStep ?? 0, totalSteps);
          const started = !done && currentStep > 0;

          const status = done
            ? t("dashTileDone")
            : started
              ? t("dashTileResume", { n: Math.min(currentStep + 1, totalSteps), total: totalSteps })
              : t("dashTileStart");

          return (
            <li key={p.id}>
              <button
                className="duo-card-tile w-full flex items-center gap-4 px-4 py-4 text-left"
                onClick={() => launch(p.id)}
                data-testid={`tile-platform-${p.id}`}
                data-state={done ? "done" : started ? "in-progress" : "start"}
              >
                <PlatformGlyph platform={p} />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[16px] font-extrabold leading-tight"
                    style={{ color: "rgb(var(--gray-text))" }}
                  >
                    {p.name}
                  </div>
                  <div
                    className="text-[12px] font-bold uppercase tracking-wider mt-1"
                    style={{
                      color: done
                        ? "rgb(var(--green))"
                        : started
                          ? "rgb(var(--blue))"
                          : "rgb(var(--nav-text))",
                    }}
                  >
                    {done ? status : `${p.estMin} ${t("minutes")} · ${status}`}
                  </div>
                </div>
                <span
                  className="tile-accessory"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: done
                      ? "rgb(var(--green))"
                      : started
                        ? "rgb(var(--blue))"
                        : "transparent",
                    border: done || started ? "0" : "2px solid rgb(var(--border-color))",
                    color: done || started ? "white" : "rgb(var(--nav-text))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                  aria-hidden
                >
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12l5 5L20 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
