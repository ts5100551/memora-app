# Memora — AI Assistant Context

> Context file for Claude Code and Cursor. Read this to understand the project before making changes.

## Project Overview

**Memora** is a personal link/article saving web app. Users paste URLs, and the app fetches metadata (title, description, thumbnail) to organize and revisit saved content. Built with Next.js + Supabase.

## Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Framework| Next.js 16 (App Router)  |
| Language | TypeScript               |
| Styling  | Vanilla CSS, CSS variables |
| Backend  | Supabase (PostgreSQL, Auth) |
| Deploy   | Vercel                   |

## Project Structure

```
memora-app/
├── docs/                 # All documentation
├── src/
│   ├── app/              # Next.js App Router (pages, layout, globals.css)
│   │   ├── links/[id]/   # Link detail page
│   │   ├── login/        # Login page (mock auth)
│   │   ├── tags/         # Tags management page
│   │   └── settings/     # Settings page
│   ├── components/       # UI components (see src/components/README.md)
│   ├── lib/              # Supabase client, mock store (see src/lib/README.md)
│   ├── hooks/            # Custom React hooks (see src/hooks/README.md)
│   ├── types/            # TypeScript interfaces
│   └── constants/        # Theme tokens, TAG_COLORS, etc.
├── public/               # Static assets
└── CLAUDE.md            # This file
```

## Key Documentation

| Doc | Purpose |
|-----|---------|
| `docs/ARCHITECTURE.md` | Tech stack, data flow, design decisions |
| `docs/DEVELOPMENT_PLAN.md` | Phase checklist, tasks, acceptance criteria |
| `docs/DEVELOPMENT.md` | Setup, env vars, scripts |
| `docs/DATABASE.md` | Supabase schema, RLS, migrations |
| `docs/API.md` | REST API spec for links, tags, metadata |
| `docs/TESTING.md` | Test cases, RWD, security checks |
| `src/*/README.md` | Per-folder conventions |

## Coding Conventions

- **Comments**: Use English for all code comments
- **Docstrings**: Use Google-style docstrings for functions (summary, Args, Returns, Raises)
- **Commits**: Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) (e.g. `feat: add theme toggle`, `fix: correct nav link`)
- **Linter**: Ignore line-length warnings; focus on semantic correctness
- **Staging**: When requirements are unclear, discuss options before coding

## Development Workflow

```bash
npm install
cp .env.example .env.local   # Add Supabase credentials (use staging for local dev)
npm run dev                   # http://localhost:3000
npm run build                 # Verify production build
npm run lint                  # ESLint
```

## Environment & Deployment

| Environment | Branch | Supabase Project | Where to Set Env |
|-------------|--------|-----------------|------------------|
| Local dev   | —      | `memora-staging` | `.env.local` |
| Vercel Production | `main` | `memora-prod` | Vercel → Production |
| Vercel Preview | `develop` and others | `memora-staging` | Vercel → Preview |

See `docs/DEVELOPMENT.md` for setup details. Push to `main` deploys Production; push to `develop` or feature branches deploys Preview.

## Current Phase

Phase 1 (Project Setup & Foundation) is **complete**.

Phase 2 (Authentication) is **partially complete**:
- ✅ Login page (`/login`) with Google button — mock only, no real OAuth
- ✅ Route protection via `AuthProvider` (client-side, localStorage)
- ✅ Logout button in Sidebar and BottomNav
- ⏳ Pending: Google OAuth setup (2.1–2.3), real `@supabase/ssr` session (2.5)

Phases 3–5 frontend UI is **complete** (with localStorage mock store):
- ✅ Add Link modal (URL input → mock metadata preview → save)
- ✅ Home page with link cards, empty state, skeleton loading
- ✅ Link detail page (`/links/[id]`) with tag management
- ✅ Tags management page (`/tags`) with color picker
- ✅ Search bar, tag filter, unread filter (all combinable)
- ✅ Settings page with usage stats and theme toggle
- ✅ Card hover animations, modal fade-in, shimmer skeleton

**Pending** (requires Supabase + Google OAuth):
- ⏳ Real Supabase auth (2.1–2.3, 2.5)
- ⏳ Database migration SQL (3.1)
- ⏳ API routes: `/api/metadata`, `/api/links`, `/api/tags` (3.2, 3.6–3.8, 4.2)

See `docs/DEVELOPMENT_PLAN.md` for full task status.

## Data Layer Note

All link and tag data currently lives in **localStorage** via `src/lib/mockStore.ts`.
The interface matches the planned Supabase schema. When real auth is ready, replace
the internals of `src/hooks/useLinks.ts` and `src/hooks/useTags.ts` with `fetch` calls
to the API routes — no component changes required.

## Folder READMEs

Each `src/` subfolder has a README.md describing conventions and usage:

- `src/components/README.md` — UI components, styling rules
- `src/lib/README.md` — Supabase client, adding new utilities
- `src/hooks/README.md` — Custom hooks, naming, examples

Refer to these when adding or modifying code in those folders.
