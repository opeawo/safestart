import { useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { Logo } from "../components/Logo";

export default function Home() {
  const { t, startSession } = useApp();
  const [, navigate] = useLocation();

  const onStart = () => {
    startSession();
    navigate("/select");
  };

  return (
    <Shell>
      {/* Hero */}
      <section
        className="relative -mx-5 -mt-6 px-5 pt-10 pb-8"
        style={{
          background: "linear-gradient(180deg, rgba(88,204,2,0.12) 0%, rgba(255,255,255,0) 100%)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <Logo size={68} />
          <div
            className="mt-4 mb-3 inline-block px-3 py-1 rounded-full text-[11px] uppercase font-extrabold tracking-widest"
            style={{
              color: "rgb(var(--green))",
              background: "rgba(88,204,2,0.12)",
            }}
          >
            {t("homeKicker")}
          </div>
          <h1
            className="font-display lowercase"
            style={{ color: "rgb(var(--green))", fontSize: 38, lineHeight: 1.0 }}
            data-testid="text-home-headline"
          >
            {t("homeHeadline")}
          </h1>
          <p
            className="mt-4 text-[15px] leading-[1.55] max-w-[480px]"
            style={{ color: "rgb(var(--gray-light))" }}
          >
            {t("homeSub")}
          </p>
        </div>
      </section>

      {/* Bullet card */}
      <section
        className="duo-card mt-2 p-5"
        style={{ borderColor: "rgb(var(--border-color))" }}
      >
        <ul className="flex flex-col gap-3">
          {[t("homeBullet1"), t("homeBullet2"), t("homeBullet3")].map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(88,204,2,0.15)", color: "rgb(var(--green))",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-[14px] font-semibold" style={{ color: "rgb(var(--gray-text))" }}>
                {b}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-6">
        <button
          className="duo-btn duo-btn--primary"
          onClick={onStart}
          data-testid="button-start"
        >
          {t("homeStart")}
        </button>
        <button
          className="duo-btn duo-btn--secondary"
          onClick={() => navigate("/select")}
          data-testid="button-resume"
        >
          {t("homeAlready")}
        </button>
      </div>
    </Shell>
  );
}
