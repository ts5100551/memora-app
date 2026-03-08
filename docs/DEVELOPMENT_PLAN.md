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

---

## Phase 2: Authentication

**Estimated Duration**: 1 day

### Tasks

| # | Task | Deliverable |
|---|---|---|
| 2.1 | Set up Google OAuth in Google Cloud Console | OAuth Client ID + Secret |
| 2.2 | Enable Google provider in Supabase Dashboard | Auth provider configured |
| 2.3 | Set up user profile trigger in Supabase (SQL) | Auto-create profile on sign-up |
| 2.4 | Build login page | Branded login UI with Google button |
| 2.5 | Implement `@supabase/ssr` auth flow | Server-side session handling |
| 2.6 | Set up Next.js middleware for route protection | Unauthenticated users redirected to `/login` |
| 2.7 | Implement logout functionality | Clear session + redirect to login |

### Checkpoint ✅

- [ ] Clicking "Login with Google" opens Google consent screen
- [ ] After consent, user is redirected to home page
- [ ] User profile is auto-created in `public.users` table
- [ ] Refreshing the page maintains login state (session persisted)
- [ ] Visiting protected routes while logged out redirects to `/login`
- [ ] Logout clears session and redirects to login

---

## Phase 3: Core Features — Link Management

**Estimated Duration**: 2-3 days

### Tasks

| # | Task | Deliverable |
|---|---|---|
| 3.1 | Execute database SQL (tables, RLS, triggers) | All tables created in Supabase |
| 3.2 | Build `POST /api/metadata` route | Server-side Open Graph fetcher |
| 3.3 | Build "Add Link" modal/page | URL input → preview → save flow |
| 3.4 | Build home page with link cards | Responsive card grid with thumbnails |
| 3.5 | Build link detail page `/links/[id]` | Full article info + actions |
| 3.6 | Build `GET /api/links` API route | List links with pagination |
| 3.7 | Build `POST /api/links` API route | Create link (auto-fetch metadata) |
| 3.8 | Build `GET/PATCH/DELETE /api/links/:id` routes | Single link CRUD |
| 3.9 | Implement empty state for home page | Friendly UI when no links saved |
| 3.10 | Handle duplicate URL detection | Show error if same URL already saved |

### Checkpoint ✅

- [ ] Pasting a URL in "Add Link" shows preview (title, description, thumbnail)
- [ ] Saving a link adds it to the home page card list
- [ ] Link detail page shows full article info
- [ ] "Open original" button opens the link in a new tab
- [ ] Deleting a link removes it from the list
- [ ] Duplicate URL shows a user-friendly error message
- [ ] API routes respond correctly to `curl` requests
- [ ] RLS prevents accessing other users' data (tested with different tokens)
- [ ] Empty state shows when no links are saved
- [ ] Cards render correctly on mobile (single column) and desktop (grid)

---

## Phase 4: Organization & Search

**Estimated Duration**: 2 days

### Tasks

| # | Task | Deliverable |
|---|---|---|
| 4.1 | Build tags management page `/tags` | Create/edit/delete tags with colors |
| 4.2 | Build `GET/POST/PATCH/DELETE /api/tags` routes | Tags CRUD API |
| 4.3 | Add tag selection to "Add Link" flow | Assign tags when saving a link |
| 4.4 | Add tag management to link detail page | Add/remove tags on existing links |
| 4.5 | Display tags on link cards (home page) | Colored tag badges on each card |
| 4.6 | Implement search bar | Search links by title |
| 4.7 | Implement tag filter | Filter links by selected tag |
| 4.8 | Implement read/unread filter | Toggle between all/unread links |
| 4.9 | Implement read/unread toggle on link cards | Mark as read/unread |

### Checkpoint ✅

- [ ] Can create tags with custom name and color
- [ ] Can edit and delete existing tags
- [ ] Tags appear on link cards on the home page
- [ ] Can assign tags when saving a new link
- [ ] Can add/remove tags from an existing link
- [ ] Search bar filters links by title in real-time
- [ ] Tag filter shows only links with the selected tag
- [ ] Unread filter shows only unread links
- [ ] Can toggle a link between read and unread
- [ ] All filters work correctly together (search + tag + unread)

---

## Phase 5: Polish & Deploy

**Estimated Duration**: 1-2 days

### Tasks

| # | Task | Deliverable |
|---|---|---|
| 5.1 | Add loading states and skeleton screens | Smooth loading experience |
| 5.2 | Add micro-animations (card hover, transitions) | Polished feel |
| 5.3 | Implement settings page | Theme toggle + account info + logout |
| 5.4 | Add PWA manifest (optional) | Add to home screen support |
| 5.5 | Final RWD testing on mobile browsers | Verified on Safari iOS + Chrome |
| 5.6 | Deploy to Vercel | Live production URL |
| 5.7 | Configure custom domain (optional) | Custom URL if desired |

### Checkpoint ✅

- [ ] All pages have loading states (no blank screens)
- [ ] Card hover effects and page transitions feel smooth
- [ ] Settings page allows theme switching and logout
- [ ] App works correctly on iPhone Safari
- [ ] App works correctly on desktop Chrome
- [ ] Production build (`npm run build`) succeeds without warnings
- [ ] App is live on Vercel
- [ ] All API routes work in production
- [ ] Google login works in production (correct redirect URLs configured)
