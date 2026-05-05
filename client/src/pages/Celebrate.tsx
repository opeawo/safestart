import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { useApp } from "../state/AppContext";
import { Shell } from "../components/Shell";
import { PLATFORMS } from "../content/platforms";
import { PlatformGlyph } from "../components/PlatformGlyph";

export default function Celebrate() {
  const { t, totalSettings, completedPlatforms, elapsedMinutes, resetAll, schoolName } = useApp();
  const [, navigate] = useLocation();
  const cardRef = useRef<HTMLCanvasElement | null>(null);

  const platformsCount = completedPlatforms.length;
  const minutes = Math.max(1, elapsedMinutes);

  const headline = useMemo(() => {
    const onePlatform = platformsCount === 1;
    const oneMin = minutes === 1;
    const key = onePlatform
      ? (oneMin ? "celebrateBodySingularOneMin" : "celebrateBodySingular")
      : (oneMin ? "celebrateBodyOneMin" : "celebrateBody");
    return t(key, { settings: totalSettings, platforms: platformsCount, minutes });
  }, [platformsCount, totalSettings, minutes, t]);

  // Render the shareable PNG card on canvas (no PII per F6.5).
  useEffect(() => {
    const c = cardRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const W = 1080, H = 1080;
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = "100%";
    c.style.height = "auto";
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#58CC02");
    g.addColorStop(1, "#4BB200");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // White rounded inner card
    const pad = 60;
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 48, "white");

    // Shield logo
    drawShield(ctx, W / 2, 220, 120);

    // "SAFE START" mark
    ctx.fillStyle = "#58CC02";
    ctx.font = "900 36px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SAFE START", W / 2, 380);

    // Big numbers row
    ctx.fillStyle = "#100F3E";
    ctx.font = "900 64px Nunito, sans-serif";
    ctx.fillText("You did it.", W / 2, 480);

    // Three stat blocks
    const statY = 600;
    const colW = (W - pad * 2 - 80) / 3;
    const colX = pad + 40;
    drawStat(ctx, colX,             statY, colW, totalSettings.toString(), totalSettings === 1 ? "setting" : "settings");
    drawStat(ctx, colX + colW,      statY, colW, platformsCount.toString(), platformsCount === 1 ? "app" : "apps");
    drawStat(ctx, colX + colW * 2,  statY, colW, minutes.toString(),        minutes === 1 ? "minute" : "minutes");

    // Date
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    ctx.fillStyle = "#777777";
    ctx.font = "700 28px Nunito, sans-serif";
    ctx.fillText(`${dd}/${mm}/${yyyy}`, W / 2, 880);

    // Footer
    ctx.fillStyle = "#AFAFAF";
    ctx.font = "800 22px Nunito, sans-serif";
    ctx.fillText("safestart.ng", W / 2, 940);

    if (schoolName) {
      ctx.fillStyle = "#4B4B4B";
      ctx.font = "700 24px Nunito, sans-serif";
      ctx.fillText(schoolName, W / 2, 980);
    }
  }, [totalSettings, platformsCount, minutes, schoolName]);

  const onShare = () => {
    const oneSetting = totalSettings === 1;
    const onePlatform = platformsCount === 1;
    const shareKey = oneSetting && onePlatform
      ? "shareMessageBothSingular"
      : oneSetting
        ? "shareMessageSettingSingular"
        : onePlatform
          ? "shareMessagePlatformSingular"
          : "shareMessage";
    const msg = t(shareKey, { settings: totalSettings, platforms: platformsCount });
    const url = `https://wa.me/?text=${encodeURIComponent(msg + "\n\nhttps://safestart.ng")}`;
    window.open(url, "_blank", "noopener");
  };

  const onDownload = () => {
    const c = cardRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "safe-start.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <Shell>
      <Confetti />

      <div className="text-center pt-2">
        <h1 className="font-display lowercase" style={{ color: "rgb(var(--green))", fontSize: 44, lineHeight: 1.0 }} data-testid="text-celebrate-headline">
          {t("celebrateHeadline")}
        </h1>
        <p className="mt-3 text-[16px] leading-[1.5]" style={{ color: "rgb(var(--gray-text))" }}>
          {headline}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat n={totalSettings}     label={totalSettings === 1 ? "setting" : "settings"} />
        <Stat n={platformsCount}    label={platformsCount === 1 ? "app" : "apps"} />
        <Stat n={minutes}           label={minutes === 1 ? "minute" : "minutes"} />
      </div>

      {/* Per-app summary */}
      <ul className="mt-6 flex flex-col gap-2">
        {PLATFORMS.filter((p) => completedPlatforms.includes(p.id)).map((p) => (
          <li key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "#F7F7F7" }}>
            <PlatformGlyph platform={p} size={32} />
            <span className="flex-1 text-[14px] font-extrabold" style={{ color: "rgb(var(--gray-text))" }}>{p.name}</span>
            <span className="duo-pill" style={{ color: "rgb(var(--green))", background: "rgba(88,204,2,0.12)" }}>
              ✓ Done
            </span>
          </li>
        ))}
      </ul>

      {/* Hidden canvas card used for download */}
      <div className="mt-6">
        <div className="text-[11px] uppercase font-extrabold tracking-widest mb-2" style={{ color: "rgb(var(--nav-text))" }}>
          Your card
        </div>
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgb(var(--border-color))" }}
        >
          <canvas ref={cardRef} aria-label="Safe Start celebration card" />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6 safe-bottom">
        <button
          className="duo-btn duo-btn--primary"
          onClick={onShare}
          data-testid="button-share-whatsapp"
        >
          {t("shareWA")}
        </button>
        <button
          className="duo-btn duo-btn--secondary"
          onClick={onDownload}
          data-testid="button-download-card"
        >
          {t("downloadCard")}
        </button>
        <button
          className="duo-btn duo-btn--ghost"
          onClick={() => { resetAll(); navigate("/home"); }}
          data-testid="button-start-over"
        >
          {t("startOver")}
        </button>
      </div>
    </Shell>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div
      className="text-center rounded-2xl py-4"
      style={{ background: "rgba(88,204,2,0.10)" }}
    >
      <div className="font-display" style={{ color: "rgb(var(--green))", fontSize: 36, lineHeight: 1 }}>
        {n}
      </div>
      <div className="text-[10px] uppercase font-extrabold tracking-wider mt-1" style={{ color: "rgb(var(--gray-light))" }}>
        {label}
      </div>
    </div>
  );
}

// ---- Canvas helpers ----
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
function drawShield(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const w = size, h = size * 1.15;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = "#58CC02";
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(w / 2, -h / 2 + h * 0.18);
  ctx.lineTo(w / 2, h * 0.10);
  ctx.quadraticCurveTo(w / 2, h / 2, 0, h / 2);
  ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h * 0.10);
  ctx.lineTo(-w / 2, -h / 2 + h * 0.18);
  ctx.closePath();
  ctx.fill();
  // checkmark
  ctx.strokeStyle = "white";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-22, 4);
  ctx.lineTo(-4, 22);
  ctx.lineTo(26, -16);
  ctx.stroke();
  ctx.restore();
}
function drawStat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, big: string, label: string) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#58CC02";
  ctx.font = "900 88px Nunito, sans-serif";
  ctx.fillText(big, x + w / 2, y + 80);
  ctx.fillStyle = "#777777";
  ctx.font = "800 22px Nunito, sans-serif";
  ctx.fillText(label.toUpperCase(), x + w / 2, y + 130);
}

// ---- Confetti ----
function Confetti() {
  const colors = ["#58CC02", "#1CB0F6", "#FFC800", "#FF9600", "#FF4B4B"];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2 + Math.random() * 2,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
    rot: Math.random() * 360,
  }));
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            width: p.size,
            height: p.size * 1.6,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}
