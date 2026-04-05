# Custom React Hooks

This folder contains custom React hooks that are shared across multiple components.

## Conventions

- **Naming**: Use `use*.ts` or `use*.tsx` (e.g. `useLinks.ts`, `useTags.ts`)
- **Export**: Each hook file exports its hook as a named export
- **Usage**: Import directly: `import { useLinks } from '@/hooks/useLinks'`

## Current Hooks

### `useLinks`

Manages the full link list state including filtering. Used on the home page and anywhere links are listed.

```ts
import { useLinks } from '@/hooks/useLinks'

const {
  links,           // Link[]  — full unfiltered list
  filteredLinks,   // Link[]  — result after search + tag + unread filters
  isLoading,       // boolean

  search,          // string
  setSearch,
  filterTagId,     // string | null
  setFilterTagId,
  filterUnread,    // boolean
  setFilterUnread,

  addLink,         // (input: CreateLinkInput) => Link   throws on duplicate URL
  removeLink,      // (id: string) => void
  toggleRead,      // (id: string) => void
  updateLinkTags,  // (id: string, tagIds: string[]) => void
  refresh,         // () => void  — force re-read from store
} = useLinks()
```

**Data source:** Currently reads from `src/lib/mockStore.ts` (localStorage).
When Supabase API routes are ready, replace the store calls inside this hook with
`fetch('/api/links')` — the returned interface stays the same.

### `useTags`

Manages the full tag list. Used on the Tags page and wherever tag selection is needed.

```ts
import { useTags } from '@/hooks/useTags'

const {
  tags,       // Tag[]  — includes link_count per tag
  addTag,     // (name: string, color: string) => Tag   throws on duplicate name
  editTag,    // (id: string, patch: UpdateTagInput) => void
  removeTag,  // (id: string) => void  — also removes tag from all links
  refresh,    // () => void
} = useTags()
```

**Data source:** Currently reads from `src/lib/mockStore.ts` (localStorage).

## Adding a New Hook

1. Create `src/hooks/useYourHook.ts`
2. Implement the hook following React hooks rules (`use` prefix, only call from components/hooks)
3. Add JSDoc with Google-style docstring
4. Update this README if the hook is a core utility
