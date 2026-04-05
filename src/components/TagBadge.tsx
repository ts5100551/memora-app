'use client'

import type { Tag } from '@/types'
import styles from './TagBadge.module.css'

interface TagBadgeProps {
  tag: Tag
  onClick?: () => void
  onRemove?: () => void
  active?: boolean
}

/** Returns white or black depending on background brightness for readable text. */
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a1a' : '#ffffff'
}

export function TagBadge({ tag, onClick, onRemove, active }: TagBadgeProps) {
  const textColor = getContrastColor(tag.color)

  return (
    <span
      className={`${styles.badge} ${onClick ? styles.clickable : ''} ${active ? styles.active : ''}`}
      style={{ backgroundColor: tag.color, color: textColor }}
      onClick={onClick}
      title={tag.name}
    >
      {tag.name}
      {onRemove && (
        <button
          className={styles.removeBtn}
          style={{ color: textColor }}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={`Remove tag ${tag.name}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
