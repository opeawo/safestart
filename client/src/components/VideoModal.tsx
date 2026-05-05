import { useEffect } from "react";
import { useApp } from "../state/AppContext";

type Props = {
  query: string;
  onClose: () => void;
};

// Plays the first YouTube search result for `query` inside an embed.
// Uses YouTube's officially supported listType=search embed parameter.
// Stays in-app — no new window.
export function VideoModal({ query, onClose }: Props) {
  const { t } = useApp();

  // Lock body scroll while open + close on Escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const embedSrc = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(
    query
  )}&autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("watchVideo")}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(16,15,62,0.78)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 720,
          background: "black",
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <button
          onClick={onClose}
          aria-label={t("closeVideo")}
          data-testid="button-close-video"
          className="no-tap-highlight"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "rgba(0,0,0,0.6)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            fontWeight: 800,
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={embedSrc}
            title={t("watchVideo")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
