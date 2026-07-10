# PWA Manifest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a web app manifest and icon set so Memora is installable to the
home screen on iOS/Android and launches in standalone mode, completing
DEVELOPMENT_PLAN.md task 5.4.

**Architecture:** Static assets only — a generated placeholder icon set in
`public/icons/`, a `public/manifest.json`, and two additions to
`src/app/layout.tsx` (`metadata.manifest`, `metadata.icons.apple`, and a new
`viewport` export for `themeColor`). No new runtime dependencies, no service
worker, no app code changes beyond `layout.tsx`.

**Tech Stack:** Next.js 16 App Router `Metadata`/`Viewport` API, `sharp-cli`
(invoked via `npx --yes sharp-cli`, not installed as a dependency) to
rasterize hand-authored SVG source into PNG icons.

## Global Constraints

- Icon is a placeholder only: solid `#6366F1` background + white "M" glyph
  drawn as an SVG polyline (no font dependency). Swappable later without spec
  changes.
- Do not add `sharp`, `sharp-cli`, or any image library to `package.json`
  dependencies or devDependencies — use `npx --yes sharp-cli` as a one-off
  tool only.
- `manifest.json` fields and values must match the spec exactly:
  `background_color: "#FFFFFF"`, `theme_color: "#6366F1"`,
  `display: "standalone"`, `start_url: "/"`.
- Next.js 16 requires `themeColor` in a `viewport` export, not `metadata`
  (putting it in `metadata` is silently ignored / build warning).
- Spec: `docs/superpowers/specs/2026-07-10-pwa-manifest-design.md`

---

### Task 1: Generate placeholder icon assets

**Files:**
- Create (scratch, not committed): SVG sources in the scratchpad directory
- Create (committed): `public/icons/icon-192.png`
- Create (committed): `public/icons/icon-192-maskable.png`
- Create (committed): `public/icons/icon-512.png`
- Create (committed): `public/icons/apple-touch-icon.png`

**Interfaces:**
- Produces: four PNG files at `public/icons/<name>.png`, referenced by exact
  path in Task 2 (`manifest.json`) and Task 3 (`layout.tsx`). File names are
  final — do not rename.

- [ ] **Step 1: Write the "any" purpose SVG source**

Create `/tmp/icon-any.svg` (or the session scratchpad dir) with this exact
content — full-bleed indigo background, "M" drawn as a stroked polyline sized
with standard icon padding (~22% margin each side, matching typical Android
adaptive-icon foreground safe area for `any` purpose icons):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#6366F1"/>
  <polyline points="22,72 22,28 50,54 78,28 78,72" fill="none" stroke="#FFFFFF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: Write the "maskable" purpose SVG source**

Maskable icons must keep all meaningful content inside the centered 80%-
diameter safe circle (OS may crop outside it). Use tighter padding
(~32% margin) so the M survives circular cropping:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#6366F1"/>
  <polyline points="32,64 32,36 50,50 68,36 68,64" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 3: Rasterize all four PNGs with `sharp-cli` via `npx`**

Run from the repo root (adjust scratch paths to wherever Step 1/2 files were
saved):

```bash
mkdir -p public/icons
npx --yes sharp-cli -i /tmp/icon-any.svg -o public/icons/icon-192.png resize 192 192
npx --yes sharp-cli -i /tmp/icon-any.svg -o public/icons/icon-512.png resize 512 512
npx --yes sharp-cli -i /tmp/icon-any.svg -o public/icons/apple-touch-icon.png resize 180 180
npx --yes sharp-cli -i /tmp/icon-maskable.svg -o public/icons/icon-192-maskable.png resize 192 192
```

- [ ] **Step 4: Verify all four files exist and are valid PNGs at the correct size**

```bash
file public/icons/*.png
```

Expected output (four lines, each `PNG image data`, with matching
dimensions):

```
public/icons/apple-touch-icon.png:      PNG image data, 180 x 180, 8-bit/color RGBA, non-interlaced
public/icons/icon-192-maskable.png:     PNG image data, 192 x 192, 8-bit/color RGBA, non-interlaced
public/icons/icon-192.png:              PNG image data, 192 x 192, 8-bit/color RGBA, non-interlaced
public/icons/icon-512.png:              PNG image data, 512 x 512, 8-bit/color RGBA, non-interlaced
```

If any file is missing or dimensions don't match, re-run the corresponding
`sharp-cli` command from Step 3 before continuing.

- [ ] **Step 5: Commit**

```bash
git add public/icons/
git commit -m "feat: add placeholder PWA icon set"
```

---

### Task 2: Add `public/manifest.json`

**Files:**
- Create: `public/manifest.json`

**Interfaces:**
- Consumes: `public/icons/icon-192.png`, `public/icons/icon-192-maskable.png`,
  `public/icons/icon-512.png` from Task 1 (paths referenced as `/icons/...`
  since `public/` is served at the site root).
- Produces: `/manifest.json` served as a static asset, referenced by
  `metadata.manifest` in Task 3.

- [ ] **Step 1: Write `public/manifest.json`**

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

- [ ] **Step 2: Verify it's valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('public/manifest.json', 'utf8')); console.log('valid JSON')"
```

Expected: `valid JSON`

- [ ] **Step 3: Commit**

```bash
git add public/manifest.json
git commit -m "feat: add PWA manifest.json"
```

---

### Task 3: Wire manifest and icons into `layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx:1-11` (current `import`/`metadata` block)

**Interfaces:**
- Consumes: `/manifest.json` (Task 2), `/icons/apple-touch-icon.png`
  (Task 1).
- Produces: none consumed by later tasks — this is the final wiring point.

- [ ] **Step 1: Update the metadata block and add a `viewport` export**

Current `src/app/layout.tsx` (lines 1-11):

```ts
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { EnvBadge } from '@/components/EnvBadge'

export const metadata: Metadata = {
  title: 'Memora — Save & Organize Links',
  description: 'Your personal link & article saving web app. Save, organize, and revisit interesting content from anywhere.',
}
```

Replace with:

```ts
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { EnvBadge } from '@/components/EnvBadge'

export const metadata: Metadata = {
  title: 'Memora — Save & Organize Links',
  description: 'Your personal link & article saving web app. Save, organize, and revisit interesting content from anywhere.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366F1',
}
```

The rest of the file (`RootLayout` function body) is unchanged.

- [ ] **Step 2: Run the production build to confirm no type/config errors**

```bash
npm run build
```

Expected: build completes successfully (exit code 0), no warnings about
`viewport`/`metadata` fields.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: no new errors introduced (pre-existing warnings, if any, are
out of scope).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire PWA manifest and icons into root layout"
```

---

### Task 4: Manual browser verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the running dev server with Tasks 1-3 applied.
- Produces: nothing for later tasks — this is the acceptance gate before
  Task 5's docs update.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000` without errors.

- [ ] **Step 2: Verify manifest loads with no errors**

Fetch the manifest directly and confirm it parses and matches Task 2's
content:

```bash
curl -s http://localhost:3000/manifest.json | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const j=JSON.parse(d); console.log('name:', j.name); console.log('icons:', j.icons.length)})"
```

Expected:
```
name: Memora — Save & Organize Links
icons: 3
```

- [ ] **Step 3: Verify all icon files are served with 200 status**

```bash
for f in icon-192.png icon-192-maskable.png icon-512.png apple-touch-icon.png; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/icons/$f")
  echo "$f: $code"
done
```

Expected: all four lines show `200`.

- [ ] **Step 4: Verify the manifest `<link>` tag is present in the rendered HTML**

```bash
curl -s http://localhost:3000/ | grep -o '<link rel="manifest"[^>]*>'
```

Expected: a line like `<link rel="manifest" href="/manifest.json"/>`.

- [ ] **Step 5: Visual check in browser (using the Browser preview tool, not curl)**

Open `http://localhost:3000` in the browser preview tool and confirm the page
loads normally with no console errors related to the manifest or icons
(check console logs for 404s or manifest parse errors). This is a sanity
check that automated asset checks (Steps 2-4) match real browser behavior —
no code changes expected here.

- [ ] **Step 6: Stop the dev server**

Stop the server process started in Step 1.

---

### Task 5: Update project docs and final commit

**Files:**
- Modify: `docs/DEVELOPMENT_PLAN.md` (Phase 5 table, row 5.4, and its
  checkpoint list — no PWA-specific checkpoint line exists yet, table status
  column only)
- Modify: `CLAUDE.md` ("Pending" bullet list under "Current Phase")

**Interfaces:** none — terminal task.

- [ ] **Step 1: Update `docs/DEVELOPMENT_PLAN.md`**

Find this row in the Phase 5 Tasks table:

```
| 5.4 | Add PWA manifest (optional) | Add to home screen support | ⏳ Pending |
```

Replace with:

```
| 5.4 | Add PWA manifest (optional) | Add to home screen support | ✅ Done |
```

- [ ] **Step 2: Update `CLAUDE.md`**

Find this line under "Pending (production launch)":

```
- ⏳ PWA manifest (5.4, optional)
```

Delete that line entirely (the remaining pending items — activating
`memora-prod`, RWD testing, Vercel deploy — are unaffected).

- [ ] **Step 3: Verify the diff is scoped to exactly these two edits**

```bash
git diff docs/DEVELOPMENT_PLAN.md CLAUDE.md
```

Expected: one changed line in each file, nothing else.

- [ ] **Step 4: Commit**

```bash
git add docs/DEVELOPMENT_PLAN.md CLAUDE.md
git commit -m "docs: mark PWA manifest (5.4) complete"
```
