# UI Components

Reusable React components for the Memora app. Styling uses CSS Modules + CSS custom properties from `globals.css` for theme consistency.

## Key Components

### Shell / Layout

| Component | Purpose |
|-----------|---------|
| **ThemeProvider** | Context for theme state (light/dark/system). Wraps the app in `layout.tsx`. Persists preference to localStorage. |
| **ThemeToggle** | Segmented control (Light / Dark / System) for switching themes. Used in Settings page. |
| **AuthProvider** | Mock auth context (`useAuth` hook). Manages `isLoggedIn` state via localStorage. Renders app shell (Sidebar + BottomNav) when logged in; bare children on `/login`. Redirects unauthenticated users to `/login`. **Replace with real Supabase session when Phase 2 backend is ready.** |
| **Navigation** | Exports `Sidebar` (desktop, min-width 768px) and `BottomNav` (mobile). Route links: Home, Tags, Settings. Both include a Logout button that calls `useAuth().logout()`. |
| **EnvBadge** | Shows "Preview" badge when `VERCEL_ENV=preview`. Used to verify Vercel Preview deployments. Hidden on Production and local. |

### Link Management

| Component | Purpose |
|-----------|---------|
| **LinkCard** | Displays a saved link as a card: thumbnail, title (2-line clamp), description, tag badges, date, read toggle, delete button. Hover animates with `translateY`. |
| **AddLinkModal** | Two-step modal: (1) URL input with validation, (2) metadata preview with editable title/description and tag selection. Duplicate URL shows inline error. Closes on Escape or backdrop click. |
| **SkeletonCard** | Placeholder card with shimmer animation shown while `useLinks` is loading. |

### Tags & Filtering

| Component | Purpose |
|-----------|---------|
| **TagBadge** | Colored pill badge for a tag. Supports `onClick` (filter), `onRemove` (detail page), and `active` (currently filtering) states. Auto-detects text contrast from background color. |
| **SearchAndFilter** | Combined search bar (debounced 300ms) + tag chip row + unread toggle. Displays result count when any filter is active. |

## Conventions

- **Naming**: PascalCase for component files (e.g. `LinkCard.tsx`)
- **Client components**: Add `'use client'` at top when using hooks, browser APIs, or event handlers
- **Styling**: Each component has a co-located `<ComponentName>.module.css`. Use `var(--color-*)` from `globals.css`. Avoid hardcoded colors except where CSS variables aren't available (e.g. inline `style` on TagBadge for dynamic colors)
- **Imports**: `@/components/<ComponentName>` for local components

## Structure

- **Layout/Shell**: `ThemeProvider`, `AuthProvider`, `Navigation` — wrap the app or provide shell layout
- **Content**: `LinkCard`, `SkeletonCard` — render data items
- **Modals/Overlays**: `AddLinkModal` — user actions
- **Micro-UI**: `TagBadge`, `SearchAndFilter` — reusable interactive elements

## Adding a New Component

1. Create `src/components/<ComponentName>.tsx`
2. Create `src/components/<ComponentName>.module.css` for styles
3. Add `'use client'` if the component uses hooks or interactivity
4. Use CSS variables from `globals.css` for colors and spacing
5. Update this README when the component is a core piece of the UI
