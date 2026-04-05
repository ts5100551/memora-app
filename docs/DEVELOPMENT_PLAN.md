# Memora — Development Plan & Checkpoints

> Detailed development phases with deliverables, acceptance criteria, and checkpoints.

---

## Phase 1: Project Setup & Foundation

**Estimated Duration**: 1 day

### Tasks

| # | Task | Deliverable |
|---|---|---|
| 1.1 | Initialize Next.js project with TypeScript | Working `npm run dev` |
| 1.2 | Set up project folder structure | `src/app`, `src/components`, `src/lib`, etc. |
| 1.3 | Configure CSS theme system | Light/dark mode with CSS custom properties |
| 1.4 | Build responsive navigation | Sidebar (desktop) + bottom nav (mobile) |
| 1.5 | Configure Supabase client | `client.ts` (browser) + `server.ts` (server-side) |
| 1.6 | Set up `.env.local` with Supabase credentials | Environment variables working |

### Checkpoint ✅

- [x] `npm run dev` starts without errors
- [x] Navigation renders correctly on desktop (sidebar) and mobile (bottom bar)
- [x] Theme toggle switches between light and dark mode
- [x] CSS variables update across all elements on theme change
- [x] `npm run build` completes without errors
- [x] Supabase staging + prod projects created; `.env.local` uses staging
- [x] Vercel deployed; Production (`main`) uses prod, Preview (other branches) uses staging

---

## Phase 2: Authentication

**Estimated Duration**: 1 day

### Tasks

| # | Task | Deliverable | Status |
|---|---|---|---|
| 2.1 | Set up Google OAuth in Google Cloud Console | OAuth Client ID + Secret | ⏳ Pending |
| 2.2 | Enable Google provider in Supabase Dashboard | Auth provider configured | ⏳ Pending |
| 2.3 | Set up user profile trigger in Supabase (SQL) | Auto-create profile on sign-up | ⏳ Pending |
| 2.4 | Build login page | Branded login UI with Google button | ✅ Done (mock) |
| 2.5 | Implement `@supabase/ssr` auth flow | Server-side session handling | ⏳ Pending |
| 2.6 | Set up Next.js middleware for route protection | Unauthenticated users redirected to `/login` | ✅ Done (mock) |
| 2.7 | Implement logout functionality | Clear session + redirect to login | ✅ Done (mock) |

> **Note (mock):** Tasks 2.4, 2.6, 2.7 are implemented as a client-side mock using `localStorage`.
> `AuthProvider` manages auth state and conditionally renders the app shell.
> Tasks 2.1–2.3 and 2.5 require backend/OAuth setup and are deferred.

### Checkpoint ✅

- [ ] Clicking "Login with Google" opens Google consent screen *(requires 2.1–2.3)*
- [ ] After consent, user is redirected to home page *(requires 2.5)*
- [ ] User profile is auto-created in `public.users` table *(requires 2.3)*
- [ ] Refreshing the page maintains login state (session persisted)
- [x] Visiting protected routes while logged out redirects to `/login` *(mock)*
- [x] Logout clears session and redirects to login *(mock)*

---

## Phase 3: Core Features — Link Management

**Estimated Duration**: 2-3 days

### Tasks

| # | Task | Deliverable | Status |
|---|---|---|---|
| 3.1 | Execute database SQL (tables, RLS, triggers) | All tables created in Supabase | ⏳ Pending |
| 3.2 | Build `POST /api/metadata` route | Server-side Open Graph fetcher | ⏳ Pending |
| 3.3 | Build "Add Link" modal/page | URL input → preview → save flow | ✅ Done (mock store) |
| 3.4 | Build home page with link cards | Responsive card grid with thumbnails | ✅ Done (mock store) |
| 3.5 | Build link detail page `/links/[id]` | Full article info + actions | ✅ Done (mock store) |
| 3.6 | Build `GET /api/links` API route | List links with pagination | ⏳ Pending |
| 3.7 | Build `POST /api/links` API route | Create link (auto-fetch metadata) | ⏳ Pending |
| 3.8 | Build `GET/PATCH/DELETE /api/links/:id` routes | Single link CRUD | ⏳ Pending |
| 3.9 | Implement empty state for home page | Friendly UI when no links saved | ✅ Done |
| 3.10 | Handle duplicate URL detection | Show error if same URL already saved | ✅ Done (mock store) |

> **Note (mock store):** Tasks 3.3–3.5, 3.9–3.10 are implemented with `src/lib/mockStore.ts`
> (localStorage-based CRUD). Data layer interface matches the planned Supabase API, so
> swapping in real API routes only requires updating `src/hooks/useLinks.ts` internals.
> Tasks 3.1–3.2, 3.6–3.8 require Supabase setup and are deferred.

### Checkpoint

- [x] Pasting a URL in "Add Link" shows preview (title, description, thumbnail) *(mock metadata)*
- [x] Saving a link adds it to the home page card list
- [x] Link detail page shows full article info
- [x] "Open original" button opens the link in a new tab
- [x] Deleting a link removes it from the list
- [x] Duplicate URL shows a user-friendly error message
- [ ] API routes respond correctly to `curl` requests *(requires 3.6–3.8)*
- [ ] RLS prevents accessing other users' data *(requires 3.1)*
- [x] Empty state shows when no links are saved
- [x] Cards render correctly on mobile (single column) and desktop (grid)

---

## Phase 4: Organization & Search

**Estimated Duration**: 2 days

### Tasks

| # | Task | Deliverable | Status |
|---|---|---|---|
| 4.1 | Build tags management page `/tags` | Create/edit/delete tags with colors | ✅ Done (mock store) |
| 4.2 | Build `GET/POST/PATCH/DELETE /api/tags` routes | Tags CRUD API | ⏳ Pending |
| 4.3 | Add tag selection to "Add Link" flow | Assign tags when saving a link | ✅ Done |
| 4.4 | Add tag management to link detail page | Add/remove tags on existing links | ✅ Done |
| 4.5 | Display tags on link cards (home page) | Colored tag badges on each card | ✅ Done |
| 4.6 | Implement search bar | Search links by title | ✅ Done |
| 4.7 | Implement tag filter | Filter links by selected tag | ✅ Done |
| 4.8 | Implement read/unread filter | Toggle between all/unread links | ✅ Done |
| 4.9 | Implement read/unread toggle on link cards | Mark as read/unread | ✅ Done |

> **Note:** Task 4.2 (API routes) deferred until Supabase setup is complete.
> All other tasks are fully implemented using `src/lib/mockStore.ts`.

### Checkpoint ✅

- [x] Can create tags with custom name and color
- [x] Can edit and delete existing tags
- [x] Tags appear on link cards on the home page
- [x] Can assign tags when saving a new link
- [x] Can add/remove tags from an existing link
- [x] Search bar filters links by title in real-time
- [x] Tag filter shows only links with the selected tag
- [x] Unread filter shows only unread links
- [x] Can toggle a link between read and unread
- [x] All filters work correctly together (search + tag + unread)

---

## Phase 5: Polish & Deploy

**Estimated Duration**: 1-2 days

### Tasks

| # | Task | Deliverable | Status |
|---|---|---|---|
| 5.1 | Add loading states and skeleton screens | Smooth loading experience | ✅ Done |
| 5.2 | Add micro-animations (card hover, transitions) | Polished feel | ✅ Done |
| 5.3 | Implement settings page | Theme toggle + account info + logout | ✅ Done |
| 5.4 | Add PWA manifest (optional) | Add to home screen support | ⏳ Pending |
| 5.5 | Final RWD testing on mobile browsers | Verified on Safari iOS + Chrome | ⏳ Pending |
| 5.6 | Deploy to Vercel | Live production URL | ⏳ Pending (after real auth) |
| 5.7 | Configure custom domain (optional) | Custom URL if desired | ⏳ Pending |

### Checkpoint

- [x] All pages have loading states (no blank screens)
- [x] Card hover effects and page transitions feel smooth
- [x] Settings page allows theme switching and logout
- [ ] App works correctly on iPhone Safari *(manual testing pending)*
- [ ] App works correctly on desktop Chrome *(manual testing pending)*
- [x] Production build (`npm run build`) succeeds without warnings
- [ ] App is live on Vercel *(pending real auth)*
- [ ] All API routes work in production *(pending Supabase setup)*
- [ ] Google login works in production *(pending 2.1–2.3)*
