import { useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { PLATFORMS } from "../content/platforms";
import { PlatformGlyph } from "../components/PlatformGlyph";

export default function PlatformSelect() {
  const { t, progress, setSelected, selectAll, selectNone, selectedIds } = useApp();
  const [, navigate] = useLocation();

  const goNext = () => {
    if (selectedIds.length === 0) return;
    const first = selectedIds[0];
    navigate(`/walkthrough/${first}/intro`);
  };

  const continueLabel = selectedIds.length === 1
    ? t("selectContinue", { n: selectedIds.length })
    : t("selectContinuePlural", { n: selectedIds.length });

  return (
    <Shell onBack={() => history.length > 1 ? history.back() : navigate("/home")}>
      <div className="text-[11px] uppercase font-extrabold tracking-widest mb-2" style={{ color: "rgb(var(--nav-text))" }}>
        {t("selectKicker")}
      </div>
      <h1 className="font-display lowercase" style={{ color: "rgb(var(--green))", fontSize: 30, lineHeight: 1.05 }}>
        {t("selectTitle")}
      </h1>
      <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: "rgb(var(--gray-light))" }}>
        {t("selectSub")}
      </p>

      <div className="flex items-center gap-2 mt-4 mb-3">
        <button
          className="px-3 h-9 rounded-full text-[12px] font-extrabold uppercase tracking-wider"
          style={{ color: "rgb(var(--blue))", background: "rgba(28,176,246,0.10)" }}
          onClick={selectAll}
          data-testid="button-select-all"
        >
          {t("selectAll")}
        </button>
        <button
          className="px-3 h-9 rounded-full text-[12px] font-extrabold uppercase tracking-wider"
          style={{ color: "rgb(var(--gray-light))", background: "rgba(0,0,0,0.04)" }}
          onClick={selectNone}
          data-testid="button-select-none"
        >
          {t("selectNone")}
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {PLATFORMS.map((p) => {
          const selected = !!progress[p.id]?.selected;
          const done = !!progress[p.id]?.done;
          return (
            <li key={p.id}>
              <button
                className="duo-card-tile w-full flex items-center gap-4 px-4 py-4 text-left"
                data-selected={selected}
                onClick={() => setSelected(p.id, !selected)}
                data-testid={`tile-platform-${p.id}`}
              >
                <PlatformGlyph platform={p} />
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-extrabold leading-tight" style={{ color: "rgb(var(--gray-text))" }}>
                    {p.name}
                  </div>
                  <div className="text-[12px] font-bold uppercase tracking-wider mt-1" style={{ color: "rgb(var(--nav-text))" }}>
                    {p.estMin} {t("minutes")}
                    {done && <> · <span style={{ color: "rgb(var(--green))" }}>{t("appComplete", { app: p.name })}</span></>}
                  </div>
                </div>
                <span
                  className="tile-check"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: selected ? "rgb(var(--blue))" : "transparent",
                    border: selected ? "0" : "2px solid rgb(var(--border-color))",
                    color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  {selected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="pt-6 safe-bottom sticky bottom-0 bg-white">
        {selectedIds.length === 0 ? (
          <p className="text-[13px] mb-2 text-center" style={{ color: "rgb(var(--gray-light))" }}>
            {t("selectAtLeastOne")}
          </p>
        ) : null}
        <button
          className="duo-btn duo-btn--primary"
          disabled={selectedIds.length === 0}
          onClick={goNext}
          data-testid="button-continue-select"
        >
          {continueLabel}
        </button>
      </div>
    </Shell>
  );
}
