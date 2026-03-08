/**
 * Environment badge for deployment verification.
 * Only rendered when VERCEL_ENV is "preview" (Vercel sets this automatically).
 * Hidden on Production and local development.
 */
export function EnvBadge() {
  if (process.env.VERCEL_ENV !== 'preview') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '6px',
        zIndex: 9999,
      }}
      aria-label="Preview environment"
    >
      Preview
    </div>
  )
}
