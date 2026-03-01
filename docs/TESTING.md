# Memora — Testing Strategy

> Testing approach, methodologies, and test cases for the Memora web app.

---

## Testing Approach

Memora uses a combination of manual testing, API testing, and automated checks
to ensure quality across all features.

| Layer | Method | Tool |
|---|---|---|
| **Build Validation** | TypeScript compilation + linting | `npm run build`, `npm run lint` |
| **API Testing** | Endpoint verification via HTTP requests | `curl`, REST client |
| **UI Testing** | Manual browser testing | Chrome DevTools, Safari iOS |
| **RWD Testing** | Responsive layout verification | Chrome DevTools device emulation |
| **Auth Testing** | Login flow + RLS boundary testing | Browser + Supabase Dashboard |

---

## 1. Build Validation

Run before every commit to catch type errors and lint issues.

```bash
# TypeScript + build check
npm run build

# Lint check
npm run lint
```

**Expected**: Both commands pass with zero errors.

---

## 2. API Testing

### 2.1 Metadata Fetcher

```bash
# Fetch metadata for a URL
curl -X POST http://localhost:3000/api/metadata \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

| Test Case | Expected Result |
|---|---|
| Valid URL with OG tags | Returns title, description, thumbnail_url |
| Valid URL without OG tags | Returns title from `<title>` tag, other fields null |
| Invalid/unreachable URL | Returns 400 with error message |
| Missing URL in body | Returns 400 with validation error |

### 2.2 Links CRUD

```bash
# Create link
curl -X POST http://localhost:3000/api/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/article"}'

# List links
curl http://localhost:3000/api/links \
  -H "Authorization: Bearer <token>"

# Get single link
curl http://localhost:3000/api/links/<id> \
  -H "Authorization: Bearer <token>"

# Update link (mark as read)
curl -X PATCH http://localhost:3000/api/links/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"is_read": true}'

# Delete link
curl -X DELETE http://localhost:3000/api/links/<id> \
  -H "Authorization: Bearer <token>"
```

| Test Case | Expected Result |
|---|---|
| Create link with valid URL | 201, link created with auto-fetched metadata |
| Create duplicate URL | 409 Conflict |
| List links (authenticated) | 200, returns only current user's links |
| List links (no auth) | 401 Unauthorized |
| Get link owned by user | 200, full link data |
| Get link owned by other user | 404 Not Found (RLS blocks) |
| Update link | 200, updated fields reflected |
| Delete link | 204 No Content |

### 2.3 Tags CRUD

| Test Case | Expected Result |
|---|---|
| Create tag | 201, tag created |
| Create duplicate tag name | 409 Conflict |
| List tags | 200, returns only current user's tags with link count |
| Update tag (name/color) | 200, updated |
| Delete tag | 204, removes tag and its link_tags associations |

### 2.4 Authentication

| Test Case | Expected Result |
|---|---|
| Request without token | 401 Unauthorized |
| Request with expired token | 401 Unauthorized |
| Request with valid token | 200, returns data |

---

## 3. UI Test Cases

### 3.1 Login Page

| Test Case | Expected |
|---|---|
| Load `/login` while logged out | Login page renders with Google button |
| Click "Login with Google" | Redirects to Google consent screen |
| Complete Google login | Redirects to home page |
| Visit `/login` while already logged in | Redirects to home page |

### 3.2 Home Page

| Test Case | Expected |
|---|---|
| Load home with no saved links | Shows empty state with "Add your first link" prompt |
| Load home with saved links | Renders link cards with title, thumbnail, tags |
| Click on a link card | Navigates to link detail page |
| Pull to refresh / refresh button | Reloads the list |
| Search by title | Cards filter in real-time |
| Filter by tag | Only matching links shown |
| Filter by unread | Only unread links shown |
| Combine search + tag + unread | Filters stack correctly |

### 3.3 Add Link

| Test Case | Expected |
|---|---|
| Open "Add Link" modal/page | URL input field is focused |
| Paste a valid URL | Auto-fetches and shows preview (title, thumbnail) |
| Paste an invalid URL | Shows validation error |
| Save without selecting tags | Link saved with no tags |
| Save with selected tags | Link saved with tags attached |
| Save duplicate URL | Shows "already saved" error |

### 3.4 Link Detail

| Test Case | Expected |
|---|---|
| View link detail | Shows title, description, thumbnail, tags, dates |
| Click "Open original" | Opens URL in new tab |
| Toggle read/unread | Status updates immediately |
| Add/remove tags | Tags update on the card |
| Delete link | Confirmation prompt → removes and returns to home |

### 3.5 Tags Management

| Test Case | Expected |
|---|---|
| View tags list | Shows all tags with name, color, link count |
| Create a new tag | Tag appears in the list |
| Edit tag name/color | Updates reflected everywhere |
| Delete tag | Confirmation → tag removed, links untagged |

### 3.6 Settings

| Test Case | Expected |
|---|---|
| View settings | Shows user info (name, email, avatar) |
| Switch to dark mode | All pages switch to dark theme |
| Switch to light mode | All pages switch to light theme |
| Switch to system mode | Theme follows device setting |
| Click logout | Session cleared, redirected to login |

---

## 4. RWD Test Matrix

Test on the following viewports using Chrome DevTools:

| Device | Width | Key Checks |
|---|---|---|
| iPhone SE | 375px | Bottom nav visible, single column cards, readable text |
| iPhone 14 | 390px | Same as above |
| iPad | 768px | Side nav appears, 2-column card grid |
| iPad Pro | 1024px | Side nav expanded, 2-3 column grid |
| Desktop | 1440px | Full layout, 3-column grid, sidebar |

### RWD Checklist

- [ ] No horizontal scrolling on any viewport
- [ ] Text is readable without zooming on mobile
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Cards don't overflow or clip content
- [ ] Modal/dialog is usable on mobile
- [ ] Navigation is accessible on all sizes

---

## 5. Cross-Browser Testing

| Browser | Platform | Priority |
|---|---|---|
| Safari | iOS (iPhone) | 🔴 Critical — primary use case |
| Chrome | macOS | 🟡 High — development browser |
| Safari | macOS | 🟢 Medium |
| Chrome | Android | 🟢 Medium (future consideration) |

---

## 6. Security Verification

| Check | How to Test |
|---|---|
| RLS enforcement | Try accessing another user's links via API with `curl` |
| Auth middleware | Visit protected pages in incognito (no session) |
| XSS prevention | Paste `<script>alert('xss')</script>` as a URL |
| CSRF protection | Supabase Auth handles this via token-based auth |
| Environment variables | Verify `.env.local` is in `.gitignore` |
