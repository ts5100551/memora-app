# Memora — Development Environment Setup

> Guide for setting up the development environment on macOS.

## Prerequisites

| Requirement | Version  | How to Install                                           |
| ----------- | -------- | -------------------------------------------------------- |
| **Node.js** | v24.12.0 | `brew install node@24` or [nodejs.org](https://nodejs.org) |
| **npm**     | v10+     | Comes with Node.js                                      |
| **Git**     | Latest   | `brew install git`                                       |

## Project Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd memora-app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your real Supabase credentials.
# NOTE:
#   - .env.example  → committed to git (template, no real secrets)
#   - .env.local    → git-ignored (contains real credentials, never commit this)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing on Mobile

1. Make sure your phone and Mac are on the same Wi-Fi network
2. Find your Mac's local IP: `ipconfig getifaddr en0`
3. On your phone browser, go to `http://<your-mac-ip>:3000`

## Project Structure

```
memora-app/
├── docs/               # Documentation
├── src/
│   ├── app/            # Next.js App Router (pages + API routes)
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utilities (Supabase client, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   └── constants/      # Theme tokens, config
├── public/             # Static assets
├── middleware.ts       # Auth middleware
└── package.json
```

## Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Build for production     |
| `npm run start`  | Start production server  |
| `npm run lint`   | Run ESLint               |

## Environment Variables

| Variable                         | Description            | Example                    |
| -------------------------------- | ---------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Supabase project URL   | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anonymous key | `eyJhbGciOi...`            |

## Deployment (Vercel)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Import Project"** → select your repo
4. Add environment variables in Vercel dashboard
5. Click **Deploy**

Vercel will automatically deploy on every push to `main` branch.
