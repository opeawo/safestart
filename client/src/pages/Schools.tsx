import { Shell } from "../components/Shell";
import { useApp } from "../state/AppContext";
import { useLocation } from "wouter";

// PRD §6.7 — public, no login, downloadable resources.
// In v0.3 we wire the Download buttons to a placeholder PDF/MP4 we ship in
// /schools-assets, which the team replaces before public launch.

const ASSETS = [
  { id: "poster",  titleKey: "schoolsPosterTitle",  subKey: "schoolsPosterSub",  files: [
      { lang: "English", url: "/schools-assets/safe-start-poster-en.pdf" },
      { lang: "Pidgin",  url: "/schools-assets/safe-start-poster-pcm.pdf" },
      { lang: "Hausa",   url: "/schools-assets/safe-start-poster-ha.pdf" },
      { lang: "Igbo",    url: "/schools-assets/safe-start-poster-ig.pdf" },
      { lang: "Yorùbá",  url: "/schools-assets/safe-start-poster-yo.pdf" },
    ] },
  { id: "video",   titleKey: "schoolsVideoTitle",   subKey: "schoolsVideoSub",   files: [
      { lang: "English", url: "/schools-assets/safe-start-explainer-en.mp4" },
      { lang: "Pidgin",  url: "/schools-assets/safe-start-explainer-pcm.mp4" },
      { lang: "Hausa",   url: "/schools-assets/safe-start-explainer-ha.mp4" },
      { lang: "Igbo",    url: "/schools-assets/safe-start-explainer-ig.mp4" },
      { lang: "Yorùbá",  url: "/schools-assets/safe-start-explainer-yo.mp4" },
    ] },
  { id: "script",  titleKey: "schoolsScriptTitle",  subKey: "schoolsScriptSub",  files: [
      { lang: "English", url: "/schools-assets/pta-script-en.pdf" },
      { lang: "Pidgin",  url: "/schools-assets/pta-script-pcm.pdf" },
      { lang: "Hausa",   url: "/schools-assets/pta-script-ha.pdf" },
      { lang: "Igbo",    url: "/schools-assets/pta-script-ig.pdf" },
      { lang: "Yorùbá",  url: "/schools-assets/pta-script-yo.pdf" },
    ] },
  { id: "brief",   titleKey: "schoolsBriefTitle",   subKey: "schoolsBriefSub",   files: [
      { lang: "English", url: "/schools-assets/head-teacher-brief-en.pdf" },
      { lang: "Pidgin",  url: "/schools-assets/head-teacher-brief-pcm.pdf" },
      { lang: "Hausa",   url: "/schools-assets/head-teacher-brief-ha.pdf" },
      { lang: "Igbo",    url: "/schools-assets/head-teacher-brief-ig.pdf" },
      { lang: "Yorùbá",  url: "/schools-assets/head-teacher-brief-yo.pdf" },
    ] },
];

export default function Schools() {
  const { t } = useApp();
  const [, navigate] = useLocation();

  // Demo tally — F7.4 says this is populated automatically; until we have
  // a backend we show a static seed so the page isn't empty.
  const tally = 27;

  return (
    <Shell onBack={() => navigate("/home")}>
      <h1 className="font-display lowercase" style={{ color: "rgb(var(--green))", fontSize: 36, lineHeight: 1.05 }}>
        {t("schoolsPageTitle")}
      </h1>
      <p className="mt-3 text-[15px] leading-[1.55]" style={{ color: "rgb(var(--gray-light))" }}>
        {t("schoolsPageSub")}
      </p>

      <div
        className="mt-5 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(88,204,2,0.10)" }}
      >
        <span style={{ fontSize: 20 }} aria-hidden>🏫</span>
        <span className="text-[14px] font-extrabold" style={{ color: "rgb(var(--green))" }}>
          {t(tally === 1 ? "schoolsTallyTitleSingular" : "schoolsTallyTitle", { n: tally })}
        </span>
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {ASSETS.map((a) => (
          <li key={a.id} className="duo-card p-5" data-testid={`card-asset-${a.id}`}>
            <div className="text-[18px] font-extrabold leading-tight" style={{ color: "rgb(var(--gray-text))" }}>
              {t(a.titleKey)}
            </div>
            <p className="mt-1 text-[13px] leading-[1.5]" style={{ color: "rgb(var(--gray-light))" }}>
              {t(a.subKey)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.files.map((f) => (
                <a
                  key={f.lang}
                  href={f.url}
                  download
                  className="duo-btn duo-btn--secondary duo-btn--sm"
                  style={{ width: "auto" }}
                  data-testid={`download-${a.id}-${f.lang}`}
                >
                  {f.lang}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
