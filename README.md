# Memora

> Your personal link & article saving web app — save, organize, and revisit interesting content from anywhere.

## What is Memora?

Memora is a web-based article/link saving tool. Paste any interesting URL and Memora automatically fetches the article's title, description, and thumbnail. Organize your saved links with custom tags, search, and filter — all from any device with a fully responsive design.

## Features

- 📥 **Save Links** — Paste a URL, auto-fetch metadata (title, thumbnail, description)
- 🏷️ **Tags** — Organize saved links with custom colored tags
- 🔍 **Search & Filter** — Find articles by title, tag, or read status
- 🔐 **Google Sign-in** — Secure authentication with cloud sync
- 🌗 **Light & Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive (RWD)** — Works great on mobile, tablet, and desktop
- 📡 **Public API** — REST API for future bot integrations (Line, Telegram)

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Vanilla CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel (free tier)

## Documentation

- [CLAUDE.md](CLAUDE.md) — AI assistant context (Claude Code, Cursor)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema & Setup](docs/DATABASE.md)
- [API Reference](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Development Plan & Checkpoints](docs/DEVELOPMENT_PLAN.md)
- [Testing Strategy](docs/TESTING.md)

## Getting Started

See [Development Guide](docs/DEVELOPMENT.md) for full setup instructions.

```bash
npm install
npm run dev
```

## License

Private — Personal use only.
