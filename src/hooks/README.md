# Custom React Hooks

This folder contains custom React hooks that are shared across multiple components.

## Conventions

- **Naming**: Use `use*.ts` or `use*.tsx` (e.g. `useLocalStorage.ts`, `useDebounce.ts`)
- **Export**: Each hook file should export its hook. Optionally use `index.ts` for re-exports.
- **Usage**: Import directly from the hook file or from `@/hooks`

## Example Hooks (for future implementation)

| Hook | Purpose |
|------|---------|
| `useLocalStorage` | Persist state to localStorage with React sync |
| `useDebounce` | Debounce a value or callback |
| `useMediaQuery` | Match media queries (e.g. breakpoints) |
| `useClickOutside` | Detect clicks outside a ref element |

## Adding a New Hook

1. Create `src/hooks/useYourHook.ts`
2. Implement the hook following React hooks rules
3. Add JSDoc with Google-style docstring
4. Update this README if the hook is a core utility
