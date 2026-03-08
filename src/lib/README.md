# Library & Utilities

This folder contains shared utilities, external service clients, and helper functions.

## Structure

```
lib/
└── supabase/     # Supabase client (Auth, Database)
    ├── client.ts # Browser-side client (use in Client Components)
    └── server.ts # Server-side client (use in Server Components, API routes)
```

## Current Modules

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

1. Create `src/lib/<module-name>/` folder
2. Add the client or utility files
3. Export the main entry point
4. Update this README with usage notes
