# Library & Utilities

This folder contains shared utilities, external service clients, and helper functions.

## Structure

```
lib/
├── mockStore.ts  # localStorage CRUD (temporary, replaced by API when Supabase is ready)
└── supabase/     # Supabase client (Auth, Database)
    ├── client.ts # Browser-side client (use in Client Components)
    └── server.ts # Server-side client (use in Server Components, API routes)
```

## Current Modules

### mockStore (`mockStore.ts`)

Provides all CRUD operations for links and tags backed by `localStorage`.
Used by `src/hooks/useLinks.ts` and `src/hooks/useTags.ts` as the data layer
until real Supabase API routes are available.

**Key exports:**

```ts
// Links
getLinksWithTags(): Link[]
getLinkById(id: string): Link | null
createLink(input: CreateLinkInput): Link     // throws 'CONFLICT' on duplicate URL
updateLink(id: string, patch: UpdateLinkInput): Link | null
deleteLink(id: string): void

// Tags
getTagsWithCounts(): Tag[]                  // includes link_count per tag
createTag(input: CreateTagInput): Tag       // throws 'CONFLICT' on duplicate name
updateTag(id: string, patch: UpdateTagInput): Tag | null
deleteTag(id: string): void                 // also removes tag from all links

// Link-Tag relations
setLinkTags(linkId: string, tagIds: string[]): void
getTagsForLink(linkId: string): Tag[]
```

**localStorage keys:**
- `memora-links` — serialized `Link[]`
- `memora-tags` — serialized `Tag[]`
- `memora-link-tags` — serialized `Record<linkId, tagId[]>`

> **Replacement path:** When Supabase auth and API routes are ready, replace the internals
> of `src/hooks/useLinks.ts` and `src/hooks/useTags.ts` with `fetch('/api/...')` calls.
> The hook interfaces are identical, so no component changes are needed.

### Supabase

- **`supabase/client.ts`** — Creates a Supabase client for browser/Client Components. Uses `@supabase/ssr` with `createBrowserClient`. Import as `createClient` from `@/lib/supabase/client`.
- **`supabase/server.ts`** — Creates a Supabase client for Server Components and API routes. Uses cookies for session handling. Import as `createClient` from `@/lib/supabase/server`. Must be called with `await` (async).

**Usage:**

```ts
// In Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// In Server Component or API route
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

## Conventions

- **Naming**: Use lowercase folder names for modules (e.g. `supabase/`). Each module may expose a `createClient` or main entry point.
- **Import path**: Use `@/lib/<module>/<file>` (e.g. `@/lib/supabase/client`)
- **External services**: Add new service clients as subfolders (e.g. `lib/analytics/`, `lib/storage/`)
- **Pure utilities**: Generic helpers (e.g. `formatDate`, `sanitizeUrl`) can live in `lib/utils.ts` or a dedicated `lib/helpers/` folder

## Adding a New Module

1. Create `src/lib/<module-name>/` folder (or `src/lib/<module>.ts` for single-file utilities)
2. Add the client or utility files
3. Export the main entry point
4. Update this README with usage notes
