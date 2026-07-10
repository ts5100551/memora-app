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
│   │   ├── login/        # Login page (Google OAuth)
│   │   ├── tags/         # Tags management page
│   │   └── settings/     # Settings page
│   ├── components/       # UI components (see src/components/README.md)
│   ├── lib/              # Supabase client, fetchMetadata, mockStore (see src/lib/README.md)
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

Phases 1–4 are **complete**. Phase 5 is **mostly complete** (pending production deployment).

**What's done:**
- ✅ Phase 1: Project setup, navigation, theme system, Supabase client
- ✅ Phase 2: Real Google OAuth via `@supabase/ssr`, server-side middleware, session sync
- ✅ Phase 3: All link CRUD API routes (`/api/links`, `/api/links/[id]`, `/api/metadata`)
- ✅ Phase 4: All tags CRUD API routes (`/api/tags`, `/api/tags/[id]`), search & filters
- ✅ Phase 5 (partial): Loading states, animations, settings page, production build

**Pending** (production launch):
- ⏳ Activate `memora-prod` Supabase project and run schema/trigger SQL
- ⏳ Final RWD testing on mobile browsers (5.5)
- ⏳ Deploy to Vercel production (5.6)

See `docs/DEVELOPMENT_PLAN.md` for full task status.

## Data Layer

All data is stored in **Supabase** (PostgreSQL) and accessed via Next.js API routes:
- `src/hooks/useLinks.ts` — fetches from `/api/links` and `/api/links/[id]`
- `src/hooks/useTags.ts` — fetches from `/api/tags` and `/api/tags/[id]`
- `src/lib/mockStore.ts` — legacy mock; no longer used by any page or hook

## Folder READMEs

Each `src/` subfolder has a README.md describing conventions and usage:

- `src/components/README.md` — UI components, styling rules
- `src/lib/README.md` — Supabase client, adding new utilities
- `src/hooks/README.md` — Custom hooks, naming, examples

Refer to these when adding or modifying code in those folders.
