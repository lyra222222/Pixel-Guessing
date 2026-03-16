import React from 'react';
import { User, Hash, Type } from 'lucide-react';

type HintType = 'artist' | 'length' | 'firstChar';

interface HintCapsuleProps {
  type: HintType;
  value?: string;
  revealed?: boolean;
}

const hintConfig = {
  artist: {
    label: '歌手提示',
    pts: '1 PTS',
    icon: User,
    className: 'hint-capsule-artist',
    revealedBg: '#3d0044',
  },
  length: {
    label: '字数提示',
    pts: '5 PTS',
    icon: Hash,
    className: 'hint-capsule-length',
    revealedBg: '#004444',
  },
  firstChar: {
    label: '首字提示',
    pts: '10 PTS',
    icon: Type,
    className: 'hint-capsule-firstchar',
    revealedBg: '#444400',
  },
};

export function HintCapsule({ type, value, revealed = false }: HintCapsuleProps) {
  const config = hintConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={config.className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        fontSize: '0.6rem',
        whiteSpace: 'nowrap',
        position: 'relative',
        minWidth: '160px',
        background: revealed ? config.revealedBg : undefined,
      }}
    >
      <Icon size={12} strokeWidth={2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '0.5rem', opacity: 0.8 }}>{config.label}</div>
        {revealed && value ? (
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              textShadow: 'currentColor 0 0 6px',
            }}
          >
            {value}
          </div>
        ) : (
          <div style={{ fontSize: '0.5rem', opacity: 0.6 }}>{config.pts}</div>
        )}
      </div>
      {/* Corner decorations */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '6px',
          height: '6px',
          background: 'currentColor',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '6px',
          height: '6px',
          background: 'currentColor',
          opacity: 0.5,
        }}
      />
    </div>
  );
}
