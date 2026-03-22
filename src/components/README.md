# UI Components

Reusable React components for the Memora app. Styling uses CSS custom properties from `globals.css` for theme consistency.

## Key Components

| Component | Purpose |
|-----------|---------|
| **ThemeProvider** | Context for theme state (light/dark/system). Wraps the app in `layout.tsx`. Persists preference to localStorage. |
| **ThemeToggle** | Segmented control (Light / Dark / System) for switching themes. Used in Settings page. |
| **AuthProvider** | Mock auth context (`useAuth` hook). Manages `isLoggedIn` state via localStorage. Renders app shell (Sidebar + BottomNav) when logged in; bare children on `/login`. Redirects unauthenticated users to `/login`. **Replace with real Supabase session in Phase 2.** |
| **Navigation** | Exports `Sidebar` (desktop, min-width 768px) and `BottomNav` (mobile). Route links: Home, Tags, Settings. Both include a Logout button that calls `useAuth().logout()`. |
| **EnvBadge** | Shows "Preview" badge when `VERCEL_ENV=preview`. Used to verify Vercel Preview deployments. Hidden on Production and local. |

## Conventions

- **Naming**: PascalCase for component files (e.g. `ThemeToggle.tsx`)
- **Client components**: Add `'use client'` at top when using hooks, browser APIs, or event handlers
- **Styling**: Use `var(--color-*)` from `globals.css`. Avoid hardcoded colors
- **Imports**: `@/components/<ComponentName>` for local components

## Structure

- **Layout/Shell**: `ThemeProvider`, `AuthProvider`, `Navigation` — wrap the app or provide shell layout
- **Interactive**: `ThemeToggle` — user-triggered UI
- **Future**: Add LinkCard, AddLinkModal, TagBadge, etc. as features are built

## Adding a New Component

1. Create `src/components/<ComponentName>.tsx`
2. Add `'use client'` if the component uses hooks or interactivity
3. Use CSS variables from `globals.css` for colors and spacing
4. Update this README when the component is a core piece of the UI
