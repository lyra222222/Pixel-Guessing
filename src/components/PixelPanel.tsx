import { type ReactNode } from 'react'

interface PixelPanelProps {
  children: ReactNode
  className?: string
  /** Optional title shown at top of panel */
  title?: string
  /** Reduce padding for nested/compact use */
  compact?: boolean
}

/**
 * Reusable pixel UI panel: 2px border, subtle shadow, dark background, pixel corners, consistent padding.
 * Use for CD collection, settings, level selection menus.
 */
export function PixelPanel({
  children,
  className = '',
  title,
  compact = false,
}: PixelPanelProps) {
  return (
    <div
      className={`pixel-panel ${compact ? 'pixel-panel-compact' : ''} ${className}`}
      role="region"
      aria-label={title ?? undefined}
    >
      {title ? (
        <h2 className="font-pixel mb-3 border-b-2 border-[var(--border)] pb-2 text-lg font-bold text-[var(--primary)]">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  )
}
