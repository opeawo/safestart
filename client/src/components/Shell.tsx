import { Link, useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { LANGUAGES } from "../i18n/strings";
import { useState } from "react";
import { Logo } from "./Logo";

type Props = {
  children: React.ReactNode;
  showHeader?: boolean;
  progressPct?: number;
  onBack?: () => void;
};

export function Shell({ children, showHeader = true, progressPct, onBack }: Props) {
  const { lang, setLang, t } = useApp();
  const [, navigate] = useLocation();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "white" }}>
      {showHeader && (
        <header
          className="sticky top-0 z-30 bg-white border-b safe-top"
          style={{ borderColor: "rgb(var(--border-color))" }}
        >
          <div className="max-w-[640px] mx-auto px-4 h-14 flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                aria-label={t("back")}
                className="w-9 h-9 -ml-2 flex items-center justify-center rounded-full no-tap-highlight"
                style={{ color: "rgb(var(--gray-light))" }}
                data-testid="button-back"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 no-tap-highlight"
              data-testid="link-home"
              aria-label={t("backToHome")}
            >
              <Logo size={28} />
              {progressPct === undefined && (
                <span
                  className="font-display text-[20px] leading-none"
                  style={{ color: "rgb(var(--green))" }}
                  data-testid="text-app-title"
                >
                  safe start
                </span>
              )}
            </Link>

            {progressPct !== undefined ? (
              <div className="flex-1 mx-2">
                <div className="duo-progress" style={{ height: 12 }}>
                  <span style={{ width: `${Math.max(2, progressPct)}%` }} />
                </div>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <button
              onClick={() => setLangOpen((v) => !v)}
              className="px-3 h-9 rounded-full text-[12px] font-extrabold uppercase tracking-wide no-tap-highlight inline-flex items-center gap-1"
              style={{ color: "rgb(var(--gray-light))" }}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              data-testid="button-lang"
            >
              <span>{(LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]).native}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {langOpen && (
            <div
              className="absolute right-3 top-14 mt-1 bg-white rounded-2xl border shadow-lg overflow-hidden"
              style={{ borderColor: "rgb(var(--border-color))", minWidth: 180 }}
              role="menu"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setLangOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-3 text-left no-tap-highlight"
                  style={{
                    background: lang === l.code ? "rgba(88,204,2,0.10)" : "white",
                    color: lang === l.code ? "rgb(var(--green))" : "rgb(var(--gray-text))",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                  data-testid={`button-lang-${l.code}`}
                >
                  <span style={{ fontSize: 16 }}>{l.flag}</span>
                  <span>{l.native}</span>
                </button>
              ))}
              <button
                onClick={() => { setLangOpen(false); navigate("/how-to-use"); }}
                className="w-full flex items-center gap-2 px-3 py-3 text-left no-tap-highlight border-t"
                style={{ borderColor: "rgb(var(--border-color))", color: "rgb(var(--gray-light))", fontWeight: 700, fontSize: 13 }}
                data-testid="button-how-to-use"
              >
                {t("howToUse")}
              </button>
              <button
                onClick={() => { setLangOpen(false); navigate("/schools"); }}
                className="w-full flex items-center gap-2 px-3 py-3 text-left no-tap-highlight border-t"
                style={{ borderColor: "rgb(var(--border-color))", color: "rgb(var(--gray-light))", fontWeight: 700, fontSize: 13 }}
                data-testid="button-schools"
              >
                {t("schools")}
              </button>
            </div>
          )}
        </header>
      )}

      <main className="flex-1 w-full">
        <div className="max-w-[640px] mx-auto px-5 pb-8 pt-6">{children}</div>
      </main>

      <footer
        className="text-center py-4 text-[11px] uppercase font-extrabold tracking-wider safe-bottom"
        style={{ color: "rgb(var(--nav-text))" }}
      >
        {t("poweredBy")}
      </footer>
    </div>
  );
}
