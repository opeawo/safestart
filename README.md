# Safe Start

A free, public-good walkthrough that helps Nigerian parents and schools set up safer accounts for children on the apps they actually use — TikTok, Instagram, YouTube, Snapchat, Roblox, WhatsApp, and Chrome.

Available in English, Naija Pidgin, Hausa, Igbo, and Yorùbá.

Live: [safestart.pplx.app](https://safestart.pplx.app) · [safestartng.vercel.app](https://safestartng.vercel.app)

## Stack

- Vite + React + TypeScript
- Tailwind CSS (Duolingo-inspired tokens)
- Wouter with hash routing
- localStorage persistence (language + per-platform progress)
- PWA-ready (manifest + service worker)

## Develop

```bash
npm install
npx vite        # dev server on :5173
npx vite build  # production build to dist/public
```

## Deploy

The app is a fully static SPA — `dist/public` can be served by any static host. Vercel config is checked in (`vercel.json`).

## A Safe Start Initiative

A ProsperityTech Initiative. Contact: hello@prosperitytech.org · partnerships@prosperitytech.org

_Last deploy: auto via GitHub_
