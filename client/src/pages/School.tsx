import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { searchSchools } from "../content/schools";

export default function School() {
  const { t, setSchool } = useApp();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const matches = useMemo(() => searchSchools(query), [query]);
  const showSuggestions = !addingNew && query.length >= 2 && !picked;

  const onSubmit = () => {
    const value = picked || (addingNew ? query.trim() : null);
    if (value) setSchool(value);
    navigate("/celebrate");
  };

  const onSkip = () => {
    setSchool(null);
    navigate("/celebrate");
  };

  return (
    <Shell onBack={() => history.back()}>
      <div className="text-[11px] uppercase font-extrabold tracking-widest mb-2" style={{ color: "rgb(var(--nav-text))" }}>
        {t("schoolKicker")}
      </div>
      <h1 className="font-display lowercase" style={{ color: "rgb(var(--green))", fontSize: 30, lineHeight: 1.05 }}>
        {t("schoolTitle")}
      </h1>
      <p className="mt-3 text-[14px] leading-[1.55]" style={{ color: "rgb(var(--gray-light))" }}>
        {t("schoolSub")}
      </p>

      <div className="mt-5 relative">
        <input
          className="duo-input"
          placeholder={t("schoolPlaceholder")}
          value={picked ?? query}
          onChange={(e) => {
            setPicked(null);
            setQuery(e.target.value);
          }}
          autoComplete="off"
          data-testid="input-school"
        />

        {showSuggestions && (
          <ul
            className="mt-2 bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgb(var(--border-color))" }}
          >
            {matches.map((m) => (
              <li key={m}>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-[rgba(28,176,246,0.08)]"
                  onClick={() => { setPicked(m); setQuery(m); }}
                  data-testid={`suggest-${m.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <span className="text-[14px] font-bold" style={{ color: "rgb(var(--gray-text))" }}>{m}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="w-full text-left px-4 py-3 border-t"
                style={{ borderColor: "rgb(var(--border-color))" }}
                onClick={() => { setAddingNew(true); setPicked(null); }}
                data-testid="button-school-not-listed"
              >
                <span className="text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "rgb(var(--blue))" }}>
                  + {t("schoolNotListed")}
                </span>
              </button>
            </li>
          </ul>
        )}

        {addingNew && (
          <div
            className="mt-3 p-3 rounded-2xl"
            style={{ background: "rgba(28,176,246,0.08)" }}
          >
            <div className="text-[12px] font-extrabold uppercase tracking-wider mb-1" style={{ color: "rgb(var(--blue))" }}>
              {t("schoolAdd")}
            </div>
            <div className="text-[13px]" style={{ color: "rgb(var(--gray-light))" }}>
              {query.trim() || "—"}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-7 safe-bottom">
        <button
          className="duo-btn duo-btn--primary"
          disabled={!(picked || (addingNew && query.trim().length > 1))}
          onClick={onSubmit}
          data-testid="button-school-submit"
        >
          {t("schoolSubmit")}
        </button>
        <button
          className="duo-btn duo-btn--ghost"
          onClick={onSkip}
          data-testid="button-school-skip"
        >
          {t("schoolSkip")}
        </button>
      </div>
    </Shell>
  );
}
