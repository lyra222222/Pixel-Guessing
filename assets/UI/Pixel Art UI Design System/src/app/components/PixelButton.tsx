import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'pink' | 'yellow' | 'green' | 'gray' | 'red' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, { bg: string; border: string; text: string; shadow: string }> = {
  cyan: {
    bg: '#0d2d33',
    border: '#00ffff',
    text: '#00ffff',
    shadow: '0 0 8px #00ffff60',
  },
  pink: {
    bg: '#2d0033',
    border: '#ff00ff',
    text: '#ff00ff',
    shadow: '0 0 8px #ff00ff60',
  },
  yellow: {
    bg: '#2d2d00',
    border: '#ffff00',
    text: '#ffff00',
    shadow: '0 0 8px #ffff0060',
  },
  green: {
    bg: '#002d1a',
    border: '#00ff88',
    text: '#00ff88',
    shadow: '0 0 8px #00ff8860',
  },
  gray: {
    bg: '#222244',
    border: '#666688',
    text: '#888899',
    shadow: 'none',
  },
  red: {
    bg: '#2d0000',
    border: '#ff4444',
    text: '#ff4444',
    shadow: '0 0 8px #ff444460',
  },
  dark: {
    bg: '#111133',
    border: '#3333aa',
    text: '#aaaadd',
    shadow: 'none',
  },
};

const sizeStyles: Record<string, { padding: string; fontSize: string }> = {
  sm: { padding: '6px 12px', fontSize: '0.55rem' },
  md: { padding: '10px 18px', fontSize: '0.65rem' },
  lg: { padding: '14px 24px', fontSize: '0.75rem' },
  xl: { padding: '18px 32px', fontSize: '0.9rem' },
};

export function PixelButton({
  variant = 'cyan',
  size = 'md',
  glow = false,
  children,
  disabled,
  style,
  className,
  ...props
}: PixelButtonProps) {
  const vs = variantStyles[variant] ?? variantStyles.cyan;
  const ss = sizeStyles[size] ?? sizeStyles.md;

  return (
    <button
      disabled={disabled}
      className={`pixel-btn ${className ?? ''}`}
      style={{
        background: vs.bg,
        borderColor: disabled ? '#444466' : vs.border,
        color: disabled ? '#444466' : vs.text,
        boxShadow: disabled
          ? '2px 2px 0 #000'
          : glow
          ? `4px 4px 0 #000, ${vs.shadow}`
          : '4px 4px 0 #000',
        padding: ss.padding,
        fontSize: ss.fontSize,
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
