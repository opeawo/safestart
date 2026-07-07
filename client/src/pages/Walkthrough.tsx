import { useLocation, useParams } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { getPlatform, PLATFORMS } from "../content/platforms";
import { PlatformGlyph } from "../components/PlatformGlyph";
import { useEffect, useMemo, useState } from "react";
import { WrapStage } from "./WalkthroughWrap";
import { VideoModal } from "../components/VideoModal";

type Stage = "intro" | "step" | "verify" | "wrap";

export default function Walkthrough() {
  const params = useParams<{ id: string; stage?: string }>();
  const [, navigate] = useLocation();
  const { t, progress, advanceStep, skipPlatform, selectedIds } = useApp();

  const platform = getPlatform(params.id || "");
  const stage = (params.stage as Stage) || "intro";

  // Quiz state
  const [chosen, setChosen] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState(0);
  const [skipDialog, setSkipDialog] = useState(false);
  const [videoOpen, setVideoOpen] = useState<
    | { src: string }
    | { query: string }
    | null
  >(null);

  useEffect(() => {
    setChosen(null);
    setWrongCount(0);
  }, [params.id, stage]);

  const stepIndex = platform ? Math.min(progress[platform.id]?.currentStep ?? 0, platform.steps.length - 1) : 0;
  const totalSteps = platform?.steps.length ?? 0;

  const overallPct = useMemo(() => {
    if (!platform) return 0;
    const total = PLATFORMS.length;
    const completedPlatforms = selectedIds.filter((id) => progress[id]?.done).length;
    if (stage === "intro") return Math.round((completedPlatforms / total) * 100);
    if (stage === "wrap") return Math.round(((completedPlatforms + 1) / total) * 100);
    // step / verify: partial credit within this platform
    const within = stage === "verify" ? 1 : (stepIndex + 1) / (totalSteps + 1);
    return Math.round(((completedPlatforms + within) / total) * 100);
  }, [platform, selectedIds, progress, stage, stepIndex, totalSteps]);

  if (!platform) {
    return (
      <Shell><p>Unknown platform.</p></Shell>
    );
  }

  const goNextPlatform = () => {
    // Find next selected platform after this one that isn't done.
    const ids = selectedIds;
    const idx = ids.indexOf(platform.id);
    const after = ids.slice(idx + 1).find((id) => !progress[id]?.done);
    if (after) navigate(`/walkthrough/${after}/intro`);
    else navigate("/school");
  };

  const onBack = () => {
    if (stage === "step" && stepIndex > 0) {
      // Step back via simple history pop
      window.history.back();
      return;
    }
    if (stage === "intro") navigate("/select");
    else if (stage === "step") navigate(`/walkthrough/${platform.id}/intro`);
    else if (stage === "verify") navigate(`/walkthrough/${platform.id}/step`);
    else if (stage === "wrap") navigate(`/walkthrough/${platform.id}/verify`);
  };

  const tryDeepLink = () => {
    // Best-effort: open the deep link in a new tab/handler.
    try {
      window.location.href = platform.deepLink;
    } catch {
      /* ignore */
    }
  };

  // ====================================================== INTRO
  if (stage === "intro") {
    return (
      <Shell progressPct={overallPct} onBack={onBack}>
        <div className="flex items-center gap-4 mb-5">
          <PlatformGlyph platform={platform} size={64} />
          <div>
            <div className="text-[11px] uppercase font-extrabold tracking-widest" style={{ color: "rgb(var(--nav-text))" }}>
              {platform.estMin} {t("minutes")}
            </div>
            <h1 className="font-display lowercase leading-none" style={{ color: "rgb(var(--green))", fontSize: 30 }}>
              {platform.name.toLowerCase()}
            </h1>
          </div>
        </div>

        <div
          className="duo-card p-5 mb-5"
          style={{ borderColor: "rgb(var(--border-color))" }}
        >
          <div className="text-[11px] uppercase font-extrabold tracking-widest mb-2" style={{ color: "rgb(var(--nav-text))" }}>
            {t("introHeading", { app: platform.name })}
          </div>
          <p className="text-[15px] leading-[1.55]" style={{ color: "rgb(var(--gray-text))" }}>
            {platform.intro}
          </p>
        </div>

        <button
          className="duo-btn duo-btn--primary"
          onClick={() => navigate(`/walkthrough/${platform.id}/step`)}
          data-testid="button-start-setup"
        >
          {t("startSetup")}
        </button>
      </Shell>
    );
  }

  // ====================================================== STEP
  if (stage === "step") {
    const step = platform.steps[stepIndex];
    const isFirstStep = stepIndex === 0;

    const onDone = () => {
      const isLast = stepIndex >= totalSteps - 1;
      advanceStep(platform.id);
      if (isLast) navigate(`/walkthrough/${platform.id}/verify`);
      // else: state advances; we stay on /step and the next step renders
    };
    const onSkip = () => setSkipDialog(true);

    return (
      <Shell progressPct={overallPct} onBack={onBack}>
        <div className="flex items-center gap-3 mb-3">
          <PlatformGlyph platform={platform} size={36} />
          <div className="text-[11px] uppercase font-extrabold tracking-widest" style={{ color: "rgb(var(--nav-text))" }}>
            {t("stepOf", { n: stepIndex + 1, total: totalSteps })}
          </div>
        </div>

        <div
          className="duo-card overflow-hidden mb-5"
          style={{ borderColor: "rgb(var(--border-color))" }}
        >
          {isFirstStep && platform.walkthroughVideoUrl ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: "black",
              }}
            >
              <iframe
                src={platform.walkthroughVideoUrl}
                title={`${platform.name} walkthrough`}
                allow="autoplay; fullscreen; encrypted-media; clipboard-write"
                allowFullScreen
                loading="lazy"
                data-testid="iframe-walkthrough-video"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center"
              style={{
                height: 160,
                background: `linear-gradient(180deg, ${platform.color}22 0%, ${platform.color}08 100%)`,
              }}
            >
              {step.illustration ? (
                <div style={{ fontSize: 80 }} aria-hidden>{step.illustration}</div>
              ) : (
                <PlatformGlyph platform={platform} size={96} />
              )}
            </div>
          )}
          <div className="p-5">
            <h2 className="text-[20px] font-extrabold leading-tight mb-2" style={{ color: "rgb(var(--gray-text))" }}>
              {step.title}
            </h2>
            <p className="text-[15px] leading-[1.55] mb-4" style={{ color: "rgb(var(--gray-light))" }}>
              {step.body}
            </p>
            {(!isFirstStep || !platform.walkthroughVideoUrl) && (
              <button
                type="button"
                onClick={() =>
                  setVideoOpen(
                    platform.walkthroughVideoUrl
                      ? { src: platform.walkthroughVideoUrl }
                      : {
                          query:
                            step.videoQuery ??
                            `${platform.name} ${step.title} tutorial 2025`,
                        }
                  )
                }
                className="inline-flex items-center gap-2 text-[14px] font-extrabold no-tap-highlight"
                style={{ color: "rgb(var(--blue))", background: "none", border: 0, padding: 0 }}
                data-testid="button-watch-video"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23 7.2c-.3-1.1-1.1-1.9-2.2-2.2C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.8.5C2.1 5.3 1.3 6.1 1 7.2.5 9.1.5 12 .5 12s0 2.9.5 4.8c.3 1.1 1.1 1.9 2.2 2.2 1.9.5 8.8.5 8.8.5s6.9 0 8.8-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.8 15.5V8.5l5.8 3.5-5.8 3.5z"/>
                </svg>
                <span>{t("watchVideo")}</span>
              </button>
            )}
          </div>
        </div>

        {isFirstStep && (
          <button
            className="duo-btn duo-btn--blue mb-3"
            onClick={tryDeepLink}
            data-testid="button-open-app"
          >
            {t("openApp", { app: platform.name })}
          </button>
        )}

        <div className="flex flex-col gap-3 safe-bottom">
          <button
            className="duo-btn duo-btn--primary"
            onClick={onDone}
            data-testid="button-step-done"
          >
            {t("done")}
          </button>
          <button
            className="duo-btn duo-btn--ghost"
            onClick={onSkip}
            data-testid="button-step-skip"
          >
            {t("skip")}
          </button>
        </div>

        {videoOpen && (
          <VideoModal
            src={"src" in videoOpen ? videoOpen.src : undefined}
            query={"query" in videoOpen ? videoOpen.query : undefined}
            onClose={() => setVideoOpen(null)}
          />
        )}

        {skipDialog && (
          <ConfirmDialog
            title={t("skipConfirm")}
            body={t("skipConfirmBody")}
            yesLabel={t("skipConfirmYes")}
            noLabel={t("skipConfirmNo")}
            onYes={() => {
              setSkipDialog(false);
              const isLast = stepIndex >= totalSteps - 1;
              advanceStep(platform.id);
              if (isLast) navigate(`/walkthrough/${platform.id}/verify`);
            }}
            onNo={() => setSkipDialog(false)}
          />
        )}
      </Shell>
    );
  }

  // ====================================================== VERIFY
  if (stage === "verify") {
    const onPick = (i: number) => setChosen(i);
    const onSubmit = () => {
      if (chosen === null) return;
      if (chosen === platform.quiz.correctIndex) {
        navigate(`/walkthrough/${platform.id}/wrap`);
      } else {
        setWrongCount((c) => c + 1);
        setChosen(null);
      }
    };
    const showHelp = wrongCount >= 3;

    return (
      <Shell progressPct={overallPct} onBack={onBack}>
        <div className="flex items-center gap-3 mb-3">
          <PlatformGlyph platform={platform} size={36} />
          <div className="text-[11px] uppercase font-extrabold tracking-widest" style={{ color: "rgb(var(--nav-text))" }}>
            {t("verifyTitle")}
          </div>
        </div>

        <h2 className="text-[20px] font-extrabold leading-tight mb-1" style={{ color: "rgb(var(--gray-text))" }}>
          {platform.quiz.question}
        </h2>
        <p className="text-[14px] mb-5" style={{ color: "rgb(var(--gray-light))" }}>
          {t("verifySub")}
        </p>

        <ul className="flex flex-col gap-3 mb-4">
          {platform.quiz.options.map((opt, i) => {
            const selected = chosen === i;
            return (
              <li key={i}>
                <button
                  className="duo-card-tile w-full text-left px-4 py-4"
                  data-selected={selected}
                  onClick={() => onPick(i)}
                  data-testid={`button-quiz-${i}`}
                >
                  <span className="text-[15px] font-bold" style={{ color: "rgb(var(--gray-text))" }}>
                    {opt}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {wrongCount > 0 && !showHelp && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,150,0,0.10)", color: "#A85F00" }}
          >
            <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1">{t("verifyWrong")}</div>
            <div className="text-[14px]">{t("verifyWrongSub")}</div>
          </div>
        )}

        {showHelp && (
          <div
            className="rounded-2xl p-4 mb-4"
            style={{ background: "rgba(255,75,75,0.08)", color: "rgb(var(--red))" }}
          >
            <div className="text-[13px] font-extrabold uppercase tracking-widest mb-1">{t("verifyHelp")}</div>
            <div className="text-[14px]" style={{ color: "rgb(var(--gray-text))" }}>
              {t("verifyHelpBody", { app: platform.name })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 safe-bottom">
          <button
            className="duo-btn duo-btn--primary"
            disabled={chosen === null}
            onClick={onSubmit}
            data-testid="button-quiz-submit"
          >
            {t("continue")}
          </button>
          {showHelp && (
            <button
              className="duo-btn duo-btn--secondary"
              onClick={() => {
                skipPlatform(platform.id);
                goNextPlatform();
              }}
              data-testid="button-quiz-skip-platform"
            >
              {t("skipPlatform")}
            </button>
          )}
        </div>
      </Shell>
    );
  }

  // ====================================================== WRAP
  if (stage === "wrap") {
    return (
      <WrapStage
        platform={platform}
        progressPct={overallPct}
        onBack={onBack}
        onNext={goNextPlatform}
        nextLabel={(() => {
          const ids = selectedIds;
          const idx = ids.indexOf(platform.id);
          const remaining = ids.slice(idx + 1).filter((id) => !progress[id]?.done);
          return remaining.length > 0 ? t("next") : t("finish");
        })()}
      />
    );
  }

  return null;
}

function ConfirmDialog({
  title, body, yesLabel, noLabel, onYes, onNo,
}: { title: string; body: string; yesLabel: string; noLabel: string; onYes: () => void; onNo: () => void; }) {
  return (
    <div
      role="dialog"
      aria-modal
      style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(16,15,62,0.45)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        padding: 16,
      }}
      onClick={onNo}
    >
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slide-up 0.2s ease" }}
      >
        <h3 className="text-[19px] font-extrabold mb-1" style={{ color: "rgb(var(--gray-text))" }}>{title}</h3>
        <p className="text-[14px] mb-5" style={{ color: "rgb(var(--gray-light))" }}>{body}</p>
        <div className="flex flex-col gap-2">
          <button className="duo-btn duo-btn--danger" onClick={onYes} data-testid="button-confirm-yes">{yesLabel}</button>
          <button className="duo-btn duo-btn--secondary" onClick={onNo} data-testid="button-confirm-no">{noLabel}</button>
        </div>
      </div>
      <style>{`@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
