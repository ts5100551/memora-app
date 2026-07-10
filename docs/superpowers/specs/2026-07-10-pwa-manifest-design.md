# PWA Manifest — Design Spec

**Date**: 2026-07-10
**Status**: Approved
**Related task**: DEVELOPMENT_PLAN.md Phase 5.4 (PWA manifest, optional)

## Purpose

Allow users to add Memora to their home screen (iOS/Android) and launch it as a
standalone app (no browser chrome). This is the last unblocked development task
in Phase 5 — 5.5 (RWD manual testing) and 5.6/5.7 (prod deploy) are out of scope
until infra is ready.

## Scope

- Generate a placeholder app icon (brand assets don't exist yet)
- Add `public/manifest.json`
- Wire manifest + iOS icons into `src/app/layout.tsx`
- Verify installability in a real browser (not just build success)

Out of scope: service worker / offline caching, push notifications, real brand
logo (placeholder only, swappable later).

## Icon

- Generated via a one-off Node script using the `canvas`-free approach: raw PNG
  encoding is unnecessary — use `sharp` if already available, otherwise render
  via an SVG → PNG conversion (`resvg` or `sharp`). Decision left to
  implementation; must not add a persistent new dependency for a placeholder
  icon (use a devDependency removed after generation, or a one-off script with
  `npx`).
- Design: solid `#6366F1` (indigo, matches `DEFAULT_TAG_COLOR` in
  `src/constants/theme.ts`) background, centered white "M", no rounded corners
  (masking handled by OS via `maskable` purpose).
- Outputs, all in `public/icons/`:
  - `icon-192.png` (192×192, `purpose: "any"`)
  - `icon-192-maskable.png` (192×192, `purpose: "maskable"`, "M" scaled down
    ~80% to sit inside the safe zone)
  - `icon-512.png` (512×512, `purpose: "any"`)
  - `apple-touch-icon.png` (180×180, no transparency — iOS ignores alpha)

## manifest.json

Location: `public/manifest.json`

```json
{
  "name": "Memora — Save & Organize Links",
  "short_name": "Memora",
  "description": "Your personal link & article saving web app.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#6366F1",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
```

`background_color` uses `#FFFFFF` (light theme base) since the manifest has no
concept of the app's dark-mode toggle — this only affects the splash screen
shown momentarily on launch.

## layout.tsx wiring

`src/app/layout.tsx` currently exports only `metadata`. Next.js 16 requires
`themeColor` to live in a separate `viewport` export (not `metadata`), and
`metadata.manifest` / `metadata.icons.apple` cover the rest:

```ts
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Memora — Save & Organize Links',
  description: '...',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366F1',
}
```

No changes to component structure or existing `<html>`/`<body>` markup.

## Testing

- `npm run build` succeeds (existing acceptance criterion)
- `npm run lint` passes
- Manual verification via dev server + browser devtools:
  - Application tab shows manifest parsed with no errors
  - Icons load (no 404s in Network tab)
  - Lighthouse PWA installability check (or manual "Add to Home Screen"
    availability) passes
- No automated test suite exists in this repo for static asset wiring; manual
  browser verification is the acceptance bar, consistent with existing Phase 5
  checkpoints (which are manual, e.g. "Card hover effects... feel smooth").

## Documentation updates

- `docs/DEVELOPMENT_PLAN.md`: mark 5.4 as `✅ Done`
- `CLAUDE.md`: no change needed (already says Phase 5 "mostly complete,
  pending production deployment" — PWA was explicitly called out as optional
  and pending; update the "Pending" bullet to drop the PWA line once done)

## Risks / edge cases

- Placeholder icon is not final branding — acceptable per user decision, swap
  later without spec changes.
- `maskable` icon safe-zone: OS may crop up to ~20% margin; text sized to
  survive this.
