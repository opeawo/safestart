import { useEffect } from "react";
import { Shell } from "../components/Shell";
import { useApp } from "../state/AppContext";
import type { Platform } from "../content/platforms";

type Props = {
  platform: Platform;
  progressPct: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
};

export function WrapStage({ platform, progressPct, onBack, onNext, nextLabel }: Props) {
  const { t, progress, markDone } = useApp();

  // Mark platform done on arrival, in an effect so we don't update state in render.
  useEffect(() => {
    if (!progress[platform.id]?.done) {
      markDone(platform.id);
    }
    // we only want this on platform change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform.id]);

  return (
    <Shell progressPct={progressPct} onBack={onBack}>
      <div className="flex flex-col items-center text-center pt-4">
        <div
          style={{
            width: 96, height: 96, borderRadius: "50%",
            background: "rgba(88,204,2,0.12)", color: "rgb(var(--green))",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}
          aria-hidden
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-display lowercase" style={{ color: "rgb(var(--green))", fontSize: 32, lineHeight: 1.05 }}>
          {t("verifyCorrect")}
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "rgb(var(--gray-light))" }}>
          {t("verifyCorrectSub", { app: platform.name })}
        </p>
      </div>

      <div
        className="duo-card mt-6 p-5"
        style={{ borderColor: "rgb(var(--border-color))" }}
      >
        <p className="text-[14px] leading-[1.55]" style={{ color: "rgb(var(--gray-text))" }}>
          {platform.wrap}
        </p>
      </div>

      <div className="pt-6 safe-bottom">
        <button
          className="duo-btn duo-btn--primary"
          onClick={onNext}
          data-testid="button-next-platform"
        >
          {nextLabel}
        </button>
      </div>
    </Shell>
  );
}
