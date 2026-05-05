import { useState } from "react";
import type { Platform } from "../content/platforms";

import tiktokLogo from "../assets/logos/tiktok.png";
import instagramLogo from "../assets/logos/instagram.png";
import youtubeLogo from "../assets/logos/youtube.png";
import snapchatLogo from "../assets/logos/snapchat.png";
import robloxLogo from "../assets/logos/roblox.png";
import chromeLogo from "../assets/logos/chrome.png";
import whatsappLogo from "../assets/logos/whatsapp.png";

// Real brand logos bundled locally. No network round-trip; works offline.
// Keyed by platform.id (matches src/content/platforms.ts).
const LOGOS: Record<string, string> = {
  tiktok: tiktokLogo,
  instagram: instagramLogo,
  youtube: youtubeLogo,
  snapchat: snapchatLogo,
  roblox: robloxLogo,
  chrome: chromeLogo,
  whatsapp: whatsappLogo,
};

export function PlatformGlyph({ platform, size = 56 }: { platform: Platform; size?: number }) {
  const [failed, setFailed] = useState(false);
  const radius = Math.round(size * 0.28);
  const logoSrc = LOGOS[platform.id];

  if (failed || !logoSrc) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: platform.color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.round(size * 0.55),
          flexShrink: 0,
          boxShadow: "0 2px 0 rgba(0,0,0,0.10)",
        }}
        aria-hidden
      >
        {platform.emoji}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 0 rgba(0,0,0,0.10)",
        border: "1px solid rgb(var(--border-color))",
        overflow: "hidden",
      }}
    >
      <img
        src={logoSrc}
        alt={`${platform.name} logo`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: radius,
          display: "block",
        }}
      />
    </div>
  );
}
