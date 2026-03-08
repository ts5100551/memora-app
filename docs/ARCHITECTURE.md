# Memora — Technical Architecture

> A personal link/article saving web app built with Next.js + Supabase.

## Overview

Memora is a web-based article/link saving tool. Users paste interesting URLs from any
source into Memora, which automatically fetches article metadata (title, description,
thumbnail) and provides a unified space to organize and revisit saved content.

The app is fully responsive (RWD) and works on desktop, tablet, and mobile browsers.

## Architecture Diagram

```
┌─────────────────────────────────┐
│         Client (Browser)        │
│   Desktop / Tablet / Mobile     │
└──────────────┬──────────────────┘
               │
    ┌──────────▼──────────┐
    │   Next.js (Vercel)  │
    │                     │
    │  ┌───────────────┐  │
    │  │ Pages (SSR)   │  │
    │  │ React + CSS   │  │
    │  └───────────────┘  │
    │                     │
    │  ┌───────────────┐  │        ┌─────────────────┐
    │  │ API Routes    │◀─┼────────│ Future Bots     │
    │  │ /api/*        │  │        │ (Line/Telegram) │
    │  └───────┬───────┘  │        └─────────────────┘
    └──────────┼──────────┘
               │
    ┌──────────▼──────────┐
    │  Supabase (Cloud)   │
    │                     │
    │  ├─ Auth (Google)   │
    │  ├─ PostgreSQL DB   │
    │  └─ Storage (opt.)  │
    └─────────────────────┘
```

## Tech Stack

| Layer           | Technology            | Purpose                                  |
| --------------- | --------------------- | ---------------------------------------- |
| Framework       | Next.js 15 App Router | SSR + API routes + file-based routing    |
| Language        | TypeScript            | Type safety                              |
| Styling         | Vanilla CSS           | CSS Variables for light/dark theming     |
| Backend / DB    | Supabase              | PostgreSQL + Auth + RLS                  |
| Authentication  | Supabase Auth         | Google OAuth via `@supabase/ssr`         |
| Metadata Fetch  | Next.js API Route     | Server-side Open Graph extraction        |
| Deployment      | Vercel (free tier)    | Auto CI/CD from GitHub                   |

## Key Design Decisions

1. **Next.js over Vite SPA**: Built-in API routes serve as public REST API for future
   bot integrations (Line Bot, Telegram Bot). SSR improves initial load.

2. **Vanilla CSS over Tailwind**: Maximum control, no build dependency. CSS custom
   properties (`--color-bg`, `--color-text`, etc.) power the light/dark theme toggle.

3. **Supabase direct client + API routes**: Pages use Supabase client directly for
   real-time feel. API routes provide the authenticated REST interface for external
   consumers (bots).

4. **Vercel deployment**: Zero-config for Next.js, free tier sufficient for personal
   use (100GB/month bandwidth).

## Component Layer

Key UI components in `src/components/`:

- **ThemeProvider** — Context for theme state (light/dark/system), persisted to localStorage
- **ThemeToggle** — Segmented control to switch themes, used in Settings page
- **Navigation** — Sidebar (desktop) and BottomNav (mobile) with route links

## Data Flow

### Saving a Link (Web)
1. User clicks "Add Link" and pastes a URL
2. Frontend calls `POST /api/metadata` to fetch Open Graph data
3. Preview shown to user (title, description, thumbnail)
4. User optionally selects tags and clicks "Save"
5. Frontend calls Supabase to insert the link record
6. Link appears in the Home feed

### Saving a Link (Future Bot)
1. User sends a URL to Line Bot / Telegram Bot
2. Bot calls `POST /api/links` with the URL and user's auth token
3. API route fetches metadata and saves to Supabase
4. Bot confirms save to user
