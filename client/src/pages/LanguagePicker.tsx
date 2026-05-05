import { useLocation } from "wouter";
import { LANGUAGES, type Lang } from "../i18n/strings";
import { useApp } from "../state/AppContext";
import { useState } from "react";
import { Logo } from "../components/Logo";

export default function LanguagePicker() {
  const { setLang, t, lang } = useApp();
  const [, navigate] = useLocation();
  const [pick, setPick] = useState<Lang | null>(lang);

  const onContinue = () => {
    if (!pick) return;
    setLang(pick);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "white" }}>
      <main className="flex-1 max-w-[640px] w-full mx-auto px-5 pt-10 pb-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Logo size={36} />
          <span className="font-display text-[26px] leading-none" style={{ color: "rgb(var(--green))" }}>
            safe start
          </span>
        </div>

        <h1
          className="font-display lowercase mb-2"
          style={{ color: "rgb(var(--green))", fontSize: 36, lineHeight: 1.05 }}
        >
          {t("pickLanguage")}
        </h1>
        <p className="text-[15px] mb-7" style={{ color: "rgb(var(--gray-light))" }}>
          {t("pickLanguageSub")}
        </p>

        <div className="flex flex-col gap-3 flex-1">
          {LANGUAGES.map((l) => {
            const selected = pick === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setPick(l.code)}
                className="duo-card-tile flex items-center gap-4 px-5 py-4 text-left"
                data-selected={selected}
                data-testid={`button-pick-${l.code}`}
              >
                <span style={{ fontSize: 28 }} aria-hidden>{l.flag}</span>
                <div className="flex-1">
                  <div className="text-[16px] font-extrabold" style={{ color: "rgb(var(--gray-text))" }}>
                    {l.native}
                  </div>
                  <div className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "rgb(var(--nav-text))" }}>
                    {l.label}
                  </div>
                </div>
                <span
                  className="tile-check"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgb(var(--blue))", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: selected ? 1 : 0,
                    transform: selected ? "scale(1)" : "scale(0.6)",
                    transition: "opacity 0.15s ease, transform 0.15s ease",
                  }}
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-6 safe-bottom">
          <button
            className="duo-btn duo-btn--primary"
            onClick={onContinue}
            disabled={!pick}
            data-testid="button-continue"
          >
            {t("continue")}
          </button>
        </div>
      </main>
    </div>
  );
}
