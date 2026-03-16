import React from 'react';
import { Lock } from 'lucide-react';

interface VinylNodeProps {
  levelId: number;
  status: 'completed' | 'unlocked' | 'locked';
  onClick?: () => void;
}

// ─── Layout constants ──────────────────────────────────────────────────────────
const NODE_SIZE = 92;                              // total bounding box (ring + disc)
const DISC_SIZE = 74;                              // inner vinyl disc diameter
const DISC_OFF  = (NODE_SIZE - DISC_SIZE) / 2;    // 9 px — disc offset inside node box
const CENTER    = NODE_SIZE / 2;                   // 46 — SVG centre point
const RING_R    = 43;                              // neon ring radius from centre

// ─── Deterministic 4-digit code per level ─────────────────────────────────────
const getCode = (id: number): string =>
  String((id * 2573 + 1337) % 10000).padStart(4, '0');

// ─── Frequency spike heights (24 bars, unlocked state) ────────────────────────
const SPIKE_H = [9, 3, 13, 4, 8, 3, 11, 5, 7, 3, 14, 4, 9, 3, 7, 5, 12, 3, 8, 4, 10, 3, 6, 4];

// ─── Groove ring radii inside the disc ────────────────────────────────────────
const GROOVES = [10, 16, 22, 28, 33];

// ─── Export ───────────────────────────────────────────────────────────────────
export function VinylNode({ levelId, status, onClick }: VinylNodeProps) {
  const isLocked    = status === 'locked';
  const isUnlocked  = status === 'unlocked';
  const isCompleted = status === 'completed';
  const isClickable = !isLocked;

  const ringColor = isCompleted ? '#ff00ff' : isUnlocked ? '#00ffff' : null;
  const code = getCode(levelId);

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      style={{
        width: NODE_SIZE,
        height: NODE_SIZE,
        position: 'relative',
        cursor: isClickable ? 'pointer' : 'not-allowed',
        transition: 'transform 0.12s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (isClickable)
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.09)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
      }}
    >
      {/* ══════════════════════════════════════════════════════════
          SVG LAYER — neon ring + frequency spikes
          (only rendered for unlocked / completed)
          ══════════════════════════════════════════════════════════ */}
      {ringColor && (
        <svg
          width={NODE_SIZE}
          height={NODE_SIZE}
          viewBox={`0 0 ${NODE_SIZE} ${NODE_SIZE}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'visible',
            pointerEvents: 'none',
            animation: isUnlocked
              ? 'svg-ring-cyan 2s ease-in-out infinite'
              : 'svg-ring-pink 1.8s ease-in-out infinite',
          }}
        >
          {/* Outer soft glow halo */}
          <circle
            cx={CENTER} cy={CENTER} r={RING_R + 3}
            fill="none"
            stroke={ringColor}
            strokeWidth="10"
            strokeOpacity="0.18"
          />

          {/* Main bright neon ring */}
          <circle
            cx={CENTER} cy={CENTER} r={RING_R}
            fill="none"
            stroke={ringColor}
            strokeWidth="2.8"
            strokeOpacity="0.96"
          />

          {/* Pixel frequency spikes — unlocked state only */}
          {isUnlocked &&
            SPIKE_H.map((h, i) => {
              const angle = (i / SPIKE_H.length) * Math.PI * 2 - Math.PI / 2;
              const x1 = CENTER + Math.cos(angle) * (RING_R + 2);
              const y1 = CENTER + Math.sin(angle) * (RING_R + 2);
              const x2 = CENTER + Math.cos(angle) * (RING_R + 2 + h);
              const y2 = CENTER + Math.sin(angle) * (RING_R + 2 + h);
              return (
                <line
                  key={i}
                  x1={x1} y1={y1}
                  x2={x2} y2={y2}
                  stroke="#00ffff"
                  strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                  strokeLinecap="square"
                  strokeOpacity={0.6 + (h / 16) * 0.36}
                />
              );
            })}
        </svg>
      )}

      {/* ══════════════════════════════════════════════════════════
          VINYL DISC
          ══════════════════════════════════════════════════════════ */}
      <div
        className="pixel-circle"
        style={{
          position: 'absolute',
          left: DISC_OFF,
          top: DISC_OFF,
          width: DISC_SIZE,
          height: DISC_SIZE,
          background: isLocked
            ? 'radial-gradient(circle at 30% 26%, #1c1c2e, #070710)'
            : 'radial-gradient(circle at 30% 26%, #171724, #040410)',
          boxShadow: 'inset 0 0 18px #00000075, 2px 2px 0 #000',
        }}
      >
        {/* Groove rings */}
        {GROOVES.map(r => (
          <div
            key={r}
            className="pixel-circle"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: r * 2,
              height: r * 2,
              border: `1px solid ${isLocked ? '#161628' : '#0d0d1e'}`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* ── Center label disc ── */}
        <div
          className="pixel-circle"
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 32,
            height: 32,
            background: isLocked
              ? 'radial-gradient(circle at 38% 33%, #5c5c72, #262636)'
              : 'radial-gradient(circle at 38% 33%, #dcdcea, #a6a6be)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {isLocked ? (
            /* ── Lock icon (pixel-art style) ── */
            <Lock
              size={14}
              color="#8b8bbb"
              strokeWidth={2.5}
              style={{ display: 'block' }}
            />
          ) : (
            /* ── Level number + spindle + code ── */
            <>
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: levelId >= 10 ? '0.29rem' : '0.36rem',
                  color: '#0e0e1c',
                  lineHeight: 1,
                  marginTop: '2px',
                  display: 'block',
                }}
              >
                {levelId}
              </span>

              {/* Spindle hole */}
              <div
                className="pixel-circle"
                style={{
                  width: 4,
                  height: 4,
                  background: '#484860',
                  margin: '1px 0',
                }}
              />

              {/* 4-digit decorative code */}
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.19rem',
                  color: '#484860',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                {code}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COMPLETED ✓ CHECKMARK
          (cyan, bottom-right, outside the disc)
          ══════════════════════════════════════════════════════════ */}
      {isCompleted && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 2,
            zIndex: 5,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.68rem',
            color: '#00ffff',
            textShadow:
              '0 0 8px #00ffff, 0 0 18px #00ffff80, 1px 1px 0 #000',
            lineHeight: 1,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}

// Export the node size so other components can use it for centering
export const VINYL_NODE_SIZE = NODE_SIZE;
