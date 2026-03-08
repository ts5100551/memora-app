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
│   │   ├── tags/         # Tags page (placeholder)
│   │   └── settings/     # Settings page (placeholder)
│   ├── components/       # UI components (see src/components/README.md)
│   ├── lib/              # Supabase client, utilities (see src/lib/README.md)
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
cp .env.example .env.local   # Add Supabase credentials
npm run dev                   # http://localhost:3000
npm run build                 # Verify production build
npm run lint                  # ESLint
```

## Current Phase

Phase 1 (Project Setup & Foundation) is **complete**. Next: Phase 2 (Authentication — login, middleware, logout).

## Folder READMEs

Each `src/` subfolder has a README.md describing conventions and usage:

- `src/components/README.md` — UI components, styling rules
- `src/lib/README.md` — Supabase client, adding new utilities
- `src/hooks/README.md` — Custom hooks, naming, examples

Refer to these when adding or modifying code in those folders.
