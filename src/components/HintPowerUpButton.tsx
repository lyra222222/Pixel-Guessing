import { type ReactNode, useState, useCallback } from 'react'
import { Lock } from 'lucide-react'

export type HintPowerUpVariant = 'standard' | 'premium'

interface HintPowerUpButtonProps {
  mainLabel: string
  costLabel: string
  icon: ReactNode
  disabled: boolean
  onClick: () => void
  variant: HintPowerUpVariant
  className?: string
}

/**
 * Power-up style hint button for the answer screen. Two-line layout: main action on top, cost below.
 * Reusable across the game. Neon pixel style with hover/press/click feedback and disabled state.
 */
export function HintPowerUpButton({
  mainLabel,
  costLabel,
  icon,
  disabled,
  onClick,
  variant,
  className = '',
}: HintPowerUpButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = useCallback(() => {
    if (disabled) return
    setIsPulsing(true)
    const count = 6
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
      }))
    )
    setTimeout(() => setParticles([]), 400)
    setTimeout(() => setIsPulsing(false), 350)
    onClick()
  }, [disabled, onClick])

  const baseClass =
    'power-up-btn font-pixel relative flex min-w-[7rem] flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-4 py-3 text-center transition-all duration-150'
  const variantClass =
    variant === 'premium' ? 'power-up-btn--premium' : 'power-up-btn--standard'
  const stateClass = disabled ? 'power-up-btn--disabled' : ''
  const pulseClass = isPulsing ? 'power-up-btn-pulse' : ''

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`${baseClass} ${variantClass} ${stateClass} ${pulseClass} ${className}`}
    >
      {/* Activation particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="power-up-particle pointer-events-none absolute left-1/2 top-1/2 text-sm opacity-80"
          style={{
            transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
            color: variant === 'premium' ? 'var(--accent)' : 'var(--primary)',
          }}
        >
          ✨
        </span>
      ))}

      <span className="flex items-center gap-1.5">
        {icon}
        <span className="power-up-main text-base font-bold leading-tight">
          {mainLabel}
        </span>
      </span>
      <span
        className={`power-up-cost text-xs leading-tight ${
          disabled ? 'power-up-cost--disabled' : ''
        }`}
      >
        {costLabel}
      </span>
      {disabled && (
        <Lock className="power-up-lock absolute right-1.5 top-1.5 h-3.5 w-3.5 opacity-70" />
      )}
    </button>
  )
}
