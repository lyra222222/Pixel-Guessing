import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useGame } from '../context/GameContext';
import { songs, TOTAL_LEVELS } from '../data/songs';
import { Home, Star } from 'lucide-react';
import { PixelButton } from '../components/PixelButton';
import { VinylNode } from '../components/VinylNode';
import { VINYL_NODE_SIZE } from '../components/VinylNode';

// ─── Layout Constants ──────────────────────────────────────────────────────────
const SW = 640;       // Street canvas width (px)
const LS = 170;       // Level vertical spacing (px)
const PAD_T = 165;    // Top padding before first node
const PAD_B = 200;    // Bottom padding after last node
const TH = PAD_T + TOTAL_LEVELS * LS + PAD_B; // Total canvas height

// ─── Node position helpers ─────────────────────────────────────────────────────
// Zigzag X positions cycling every 8 levels
const X_PAT = [168, 472, 218, 422, 148, 492, 198, 452];
const nodeX = (i: number) => X_PAT[i % X_PAT.length];
const nodeY = (i: number) => PAD_T + i * LS;

// ─── SVG Path generator ────────────────────────────────────────────────────────
function buildSvgPath(): string {
  const pts = Array.from({ length: TOTAL_LEVELS }, (_, i) => [nodeX(i), nodeY(i)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const dy = cy - py;
    d += ` C ${px} ${py + dy * 0.56} ${cx} ${cy - dy * 0.44} ${cx} ${cy}`;
  }
  return d;
}
const PATH_D = buildSvgPath();

// ─── Building type definitions ─────────────────────────────────────────────────
type BType = 'records' | 'club' | 'vinyl' | 'beats' | 'studio';
const B_TYPES: BType[] = ['records', 'club', 'vinyl', 'beats', 'studio'];

interface BCfg {
  wall: string; border: string;
  sign: string; signColor: string;
  h: number;
}
const B_CFG: Record<BType, BCfg> = {
  records: { wall: '#05050f', border: '#2e1242', sign: 'RECORDS',   signColor: '#ff00ff', h: 174 },
  club:    { wall: '#0a0400', border: '#3a1400', sign: 'MUSIC CLUB', signColor: '#ffaa00', h: 156 },
  vinyl:   { wall: '#000d0d', border: '#002828', sign: 'VINYL',      signColor: '#00ffff', h: 190 },
  beats:   { wall: '#06000c', border: '#1c0032', sign: 'BEAT SHOP',  signColor: '#cc00ff', h: 149 },
  studio:  { wall: '#010b04', border: '#002c14', sign: 'STUDIO REC', signColor: '#00ff88', h: 168 },
};

// ─── Decoration data (fully deterministic) ────────────────────────────────────

// 14 building pairs spaced every ~3.5 levels
const BUILDINGS = Array.from({ length: 14 }, (_, i) => ({
  y: PAD_T + LS * 1.1 + i * LS * 3.5,
  leftType: B_TYPES[i % B_TYPES.length],
  rightType: B_TYPES[(i + 2) % B_TYPES.length],
}));

// Street lamps every ~2.2 levels on each side
const LAMP_YS = Array.from({ length: 23 }, (_, i) => PAD_T * 0.1 + i * LS * 2.2);

// Neon sign texts (20 signs, alternating sides)
const SIGN_DATA = [
  { t: '♪ MUSIC ♪',  c: '#ff00ff' },
  { t: 'RECORDS',     c: '#00ffff' },
  { t: '▶ PLAY',      c: '#00ff88' },
  { t: 'VINYL SHOP',  c: '#ffaa00' },
  { t: 'HIT STORE',   c: '#ff00ff' },
  { t: 'OPEN 24H',    c: '#00ffff' },
  { t: '♫ BEATS',     c: '#cc00ff' },
  { t: 'STUDIO REC',  c: '#00ff88' },
  { t: 'TOP 50 DJ',   c: '#00ffff' },
  { t: 'MUSIC BAR',   c: '#ffaa00' },
  { t: 'VINYL+',      c: '#ff00ff' },
  { t: 'NEON CITY',   c: '#00ffff' },
  { t: 'RECORD HQ',   c: '#cc00ff' },
  { t: '♩ NOTES',     c: '#00ff88' },
  { t: 'BEST HITS',   c: '#ffaa00' },
  { t: 'B-SIDE',      c: '#ff00ff' },
  { t: 'REMIXED',     c: '#00ffff' },
  { t: 'PLAYLIST',    c: '#00ff88' },
  { t: 'DOWNLOAD',    c: '#ffaa00' },
  { t: 'LIVE MUSIC',  c: '#ff00ff' },
];
const NEON_SIGNS = SIGN_DATA.map((s, i) => ({
  text: s.t, color: s.c,
  x: i % 2 === 0 ? 8 + (i % 6) * 5 : 487 - (i % 6) * 5,
  y: PAD_T + i * LS * 2.48 + 28,
}));

// Floating music notes scattered through the entire street
const NOTE_SYMS = ['♪', '♫', '♬', '♩'];
const NOTE_COLS = ['#ff00ff90', '#00ffff90', '#ffff0090', '#ff880090', '#00ff8890'];
const FLOAT_NOTES = Array.from({ length: 26 }, (_, i) => ({
  sym: NOTE_SYMS[i % NOTE_SYMS.length],
  color: NOTE_COLS[i % NOTE_COLS.length],
  x: 120 + (i * 181 % 398),
  y: 60 + Math.floor(i * TH / 26),
  delay: ((i * 0.44) % 3.6).toFixed(1),
  dur: (3 + (i % 4)).toString(),
}));

// Background pixel stars (sky area)
const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: 15 + (i * 29 % 612),
  y: 8 + (i * 17 % 110),
  size: i % 3 === 0 ? 3 : 2,
  delay: ((i * 0.6) % 4).toFixed(1),
}));

// ─── Appear-delay helper ───────────────────────────────────────────────────────
// First-visible zone (~4 levels deep): stagger 0.08 → 1.8s
// Off-screen: tiny delay (already animated by scroll time)
const FIRST_VIS_H = PAD_T + 4.5 * LS;
const appearDelay = (y: number): string => {
  if (y > FIRST_VIS_H) return '0.06';
  return Math.max(0.08, (y / FIRST_VIS_H) * 1.8).toFixed(2);
};

// ─── PixelBuilding ─────────────────────────────────────────────────────────────
function PixelBuilding({
  y, type, side, mounted,
}: { y: number; type: BType; side: 'left' | 'right'; mounted: boolean }) {
  const c = B_CFG[type];
  const isLeft = side === 'left';
  const x = isLeft ? 0 : SW - 112;
  const delay = appearDelay(y);

  return (
    <div style={{
      position: 'absolute', left: x, top: y - c.h,
      width: 112, height: c.h,
      background: c.wall,
      border: `3px solid ${c.border}`,
      boxShadow: isLeft
        ? `5px 0 16px #00000092, inset -1px 0 6px ${c.border}`
        : `-5px 0 16px #00000092, inset 1px 0 6px ${c.border}`,
      zIndex: 3,
      opacity: mounted ? undefined : 0,
      animation: mounted ? `neon-flicker-in 0.9s ${delay}s both` : 'none',
    }}>
      {/* Roof ledge */}
      <div style={{
        position: 'absolute', top: -9, left: -3, right: -3, height: 9,
        background: c.wall, border: `3px solid ${c.border}`, borderBottom: 'none',
      }} />
      {/* Top stripe */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: c.border }} />
      {/* Neon sign */}
      <div className="sign-flicker-anim" style={{
        margin: '9px 5px 7px',
        background: `${c.signColor}14`,
        border: `2px solid ${c.signColor}`,
        padding: '4px 2px',
        textAlign: 'center',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '0.27rem',
        color: c.signColor,
        textShadow: `0 0 6px ${c.signColor}`,
        boxShadow: `0 0 10px ${c.signColor}55, 2px 2px 0 #000`,
      }}>
        {c.sign}
      </div>
      {/* Windows 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, padding: '0 10px' }}>
        {[0, 1, 2, 3].map(wi => (
          <div key={wi} style={{
            height: 20,
            background: wi % 2 === 0 ? `${c.signColor}1a` : `${c.signColor}08`,
            border: `2px solid ${wi % 2 === 0 ? c.signColor + '72' : c.border}`,
            boxShadow: wi % 2 === 0 ? `0 0 6px ${c.signColor}44` : 'none',
          }} />
        ))}
      </div>
      {/* Speaker / beat dots for beats & studio */}
      {(type === 'beats' || type === 'studio') && (
        <div style={{
          margin: '6px 8px 0',
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3,
          padding: 4, background: `${c.signColor}10`,
          border: `1px solid ${c.border}`,
        }}>
          {Array.from({ length: 12 }).map((_, di) => (
            <div key={di} className="pixel-circle" style={{
              width: 6, height: 6,
              background: di % 3 === 0 ? c.signColor : c.border,
            }} />
          ))}
        </div>
      )}
      {/* Ground floor */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 42,
        background: `${c.signColor}0a`,
        borderTop: `2px solid ${c.signColor}45`,
      }}>
        {/* Door */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 26, height: 37,
          background: `${c.signColor}18`,
          border: `2px solid ${c.signColor}65`, borderBottom: 'none',
        }}>
          {/* Door handle */}
          <div style={{
            position: 'absolute', top: '50%',
            ...(isLeft ? { right: 4 } : { left: 4 }),
            width: 3, height: 8,
            background: c.signColor,
            boxShadow: `0 0 4px ${c.signColor}`,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── StreetLamp (CD-style) ─────────────────────────────────────────────────────
function StreetLamp({
  y, side, mounted,
}: { y: number; side: 'left' | 'right'; mounted: boolean }) {
  const isLeft = side === 'left';
  const containerLeft = isLeft ? 74 : SW - 100;
  const delay = appearDelay(y);

  return (
    <div style={{
      position: 'absolute', left: containerLeft, top: y,
      zIndex: 4, width: 30, height: 90,
      opacity: mounted ? undefined : 0,
      animation: mounted ? `neon-flicker-in 0.7s ${delay}s both` : 'none',
    }}>
      {/* Vertical pole */}
      <div style={{
        position: 'absolute', left: 10, top: 20, width: 4, height: 70,
        background: 'linear-gradient(180deg, #1c1c3c, #090918)',
        border: '1px solid #282848',
      }} />
      {/* Horizontal arm */}
      <div style={{
        position: 'absolute', top: 20,
        ...(isLeft ? { left: 12 } : { left: -10 }),
        width: 22, height: 3,
        background: '#1c1c3c', border: '1px solid #282848',
      }} />
      {/* CD disc light */}
      <div className="pixel-circle" style={{
        position: 'absolute', top: 5,
        ...(isLeft ? { left: 26 } : { left: -20 }),
        width: 24, height: 24,
        background: 'radial-gradient(circle at 32% 32%, #182840, #050614)',
        border: '2px solid #00ffff',
        boxShadow: '0 0 12px #00ffff, 0 0 26px #00ffff55',
      }}>
        {/* Center hole */}
        <div className="pixel-circle" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 7, height: 7,
          background: '#00020a', border: '1px solid #00aaaa',
        }} />
        {/* Groove ring */}
        <div className="pixel-circle" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 16, height: 16,
          border: '1px solid #00ffff30',
        }} />
      </div>
      {/* Light cone (glow on ground) */}
      <div style={{
        position: 'absolute', top: 28,
        ...(isLeft ? { left: 30 } : { left: -12 }),
        width: 6, height: 50,
        background: `linear-gradient(180deg, #00ffff15, transparent)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ─── NeonSignDeco ─────────────────────────────────────────────────────────────
function NeonSignDeco({
  text, color, x, y, mounted,
}: { text: string; color: string; x: number; y: number; mounted: boolean }) {
  const delay = appearDelay(y);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, zIndex: 5,
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.32rem',
      color,
      textShadow: `0 0 6px ${color}, 0 0 14px ${color}`,
      background: '#020208',
      border: `2px solid ${color}`,
      padding: '4px 8px',
      boxShadow: `0 0 10px ${color}55, 3px 3px 0 #000`,
      whiteSpace: 'nowrap',
      opacity: mounted ? undefined : 0,
      animation: mounted ? `neon-flicker-in 0.7s ${delay}s both` : 'none',
    }}>
      {text}
    </div>
  );
}

// ─── Main LevelMap Component ──────────────────────────────────────────────────
export function LevelMap() {
  const navigate = useNavigate();
  const { score, isUnlocked, isCompleted } = useGame();
  const [mounted, setMounted] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trigger entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll to first active level after entrance animation completes
  useEffect(() => {
    if (!mounted) return;
    const firstActive = songs.findIndex(s => !isCompleted(s.id) && isUnlocked(s.id));
    if (firstActive >= 0) {
      const targetY = nodeY(firstActive) - 260;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }, 2400);
    }
  }, [mounted]);

  const getStatus = (id: number): 'completed' | 'unlocked' | 'locked' => {
    if (isCompleted(id)) return 'completed';
    if (isUnlocked(id)) return 'unlocked';
    return 'locked';
  };

  const completedCount = songs.filter((_, i) => isCompleted(i + 1)).length;
  const unlockedCount  = songs.filter((_, i) => isUnlocked(i + 1)).length;

  return (
    <div
      className="crt-flicker"
      style={{ height: '100vh', overflow: 'hidden', background: '#0a0a1c', position: 'relative' }}
    >
      {/* ── CRT scanlines (fixed) ── */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.065) 3px, rgba(0,0,0,0.065) 4px)',
        pointerEvents: 'none', zIndex: 999,
      }} />

      {/* ════════════════════════════════════════════
          FIXED STATUS BAR
          ════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(180deg, #08081a 0%, #0c0c22 100%)',
        borderBottom: '3px solid #2a2a6e',
        boxShadow: '0 4px 0 #000, 0 0 24px #00ffff1a',
        padding: '9px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 10, flexWrap: 'wrap',
      }}>
        {/* Back button */}
        <PixelButton variant="dark" size="sm" onClick={() => navigate('/')}>
          <Home size={11} /> 首页
        </PixelButton>

        {/* Title */}
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '0.56rem',
          color: '#ff00ff',
          textShadow: '2px 2px 0 #000, 0 0 12px #ff00ff80',
          letterSpacing: '2px',
        }}>
          ◈ MUSIC STREET ◈
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Score */}
          <div style={{
            background: '#0a0a1c', border: '2px solid #ffff00',
            padding: '4px 9px',
            fontFamily: "'Press Start 2P', monospace", fontSize: '0.46rem',
            color: '#ffff00', textShadow: '1px 1px 0 #000',
            boxShadow: '2px 2px 0 #000, 0 0 8px #ffff0055',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Star size={10} fill="#ffff00" color="#ffff00" /> {score} PTS
          </div>
          {/* Completed */}
          <div style={{
            background: '#0a0a1c', border: '2px solid #00ff88',
            padding: '4px 9px',
            fontFamily: "'Press Start 2P', monospace", fontSize: '0.46rem',
            color: '#00ff88', textShadow: '1px 1px 0 #000',
            boxShadow: '2px 2px 0 #000, 0 0 8px #00ff8855',
          }}>
            ✓ {completedCount}/{TOTAL_LEVELS}
          </div>
          {/* Unlocked */}
          <div style={{
            background: '#0a0a1c', border: '2px solid #00ffff',
            padding: '4px 9px',
            fontFamily: "'Press Start 2P', monospace", fontSize: '0.46rem',
            color: '#00ffff', textShadow: '1px 1px 0 #000',
            boxShadow: '2px 2px 0 #000, 0 0 8px #00ffff55',
          }}>
            ★ {unlockedCount} 解锁
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          SCROLLABLE STREET
          ════════════════════════════════════════════ */}
      <div
        ref={scrollRef}
        style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden', paddingTop: '55px' }}
      >
        {/* Street outer wrapper — centers the 640px canvas */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          background: 'linear-gradient(180deg, #07071a 0%, #090916 40%, #07071a 100%)',
          minHeight: TH + 60,
        }}>

          {/* ── Street Canvas (640px fixed) ── */}
          <div style={{
            width: SW, position: 'relative', flexShrink: 0, height: TH,
          }}>

            {/* Subtle grid texture */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `
                repeating-linear-gradient(90deg, rgba(40,40,100,0.06) 0px, rgba(40,40,100,0.06) 1px, transparent 1px, transparent 80px),
                repeating-linear-gradient(0deg,  rgba(40,40,100,0.04) 0px, rgba(40,40,100,0.04) 1px, transparent 1px, transparent 80px)
              `,
            }} />

            {/* Pixel stars in sky area */}
            {STARS.map((s, i) => (
              <div key={i} style={{
                position: 'absolute', left: s.x, top: s.y,
                width: s.size, height: s.size,
                background: '#ffffff',
                boxShadow: '0 0 3px #ffffff',
                animation: `star-twinkle ${2 + (i % 3)}s ${s.delay}s ease-in-out infinite`,
                zIndex: 1,
              }} />
            ))}

            {/* Left / Right curb lines */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 113, width: 3,
              background: 'linear-gradient(180deg, transparent, #1a1a50 6%, #1a1a50 94%, transparent)',
              boxShadow: '0 0 8px #2a2a70',
            }} />
            <div style={{
              position: 'absolute', top: 0, bottom: 0, right: 113, width: 3,
              background: 'linear-gradient(180deg, transparent, #1a1a50 6%, #1a1a50 94%, transparent)',
              boxShadow: '0 0 8px #2a2a70',
            }} />

            {/* Street lane glow (center strip) */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%',
              transform: 'translateX(-50%)', width: 240,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,255,0.025) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 1,
            }} />

            {/* ═══ Buildings ═══ */}
            {BUILDINGS.map((b, i) => (
              <React.Fragment key={i}>
                <PixelBuilding y={b.y} type={b.leftType}  side="left"  mounted={mounted} />
                <PixelBuilding y={b.y} type={b.rightType} side="right" mounted={mounted} />
              </React.Fragment>
            ))}

            {/* ═══ Street Lamps ═══ */}
            {LAMP_YS.map((y, i) => (
              <React.Fragment key={i}>
                <StreetLamp y={y} side="left"  mounted={mounted} />
                <StreetLamp y={y} side="right" mounted={mounted} />
              </React.Fragment>
            ))}

            {/* ═══ Neon Signs ═══ */}
            {NEON_SIGNS.map((s, i) => (
              <NeonSignDeco key={i} text={s.text} color={s.color} x={s.x} y={s.y} mounted={mounted} />
            ))}

            {/* ═══ Floating Music Notes ═══ */}
            {FLOAT_NOTES.map((n, i) => (
              <div key={i} style={{
                position: 'absolute', left: n.x, top: n.y,
                fontSize: '1.05rem', color: n.color,
                textShadow: `0 0 8px ${n.color}`,
                animation: `float-note ${n.dur}s ${n.delay}s ease-in-out infinite`,
                zIndex: 6, pointerEvents: 'none',
              }}>
                {n.sym}
              </div>
            ))}

            {/* ═══ SVG Glowing Path ═══ */}
            <svg
              width={SW} height={TH}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 7, pointerEvents: 'none' }}
              viewBox={`0 0 ${SW} ${TH}`}
            >
              <defs>
                <filter id="pglow" x="-40%" y="-5%" width="180%" height="110%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Outer glow halo */}
              <path d={PATH_D} fill="none" stroke="#00ffff" strokeWidth="18" strokeOpacity="0.055" filter="url(#pglow)" />
              {/* Dark road base */}
              <path d={PATH_D} fill="none" stroke="#001010" strokeWidth="10" />
              {/* Inner road surface */}
              <path d={PATH_D} fill="none" stroke="#003030" strokeWidth="6" strokeOpacity="0.7" />
              {/* Animated cyan dash (road marking) */}
              <path
                d={PATH_D} fill="none"
                stroke="#00ffff" strokeWidth="2"
                strokeDasharray="9 5"
                strokeLinecap="square"
                strokeOpacity="0.72"
                style={{ animation: 'path-dash 1.6s linear infinite' }}
              />
              {/* Node connector dots */}
              {Array.from({ length: TOTAL_LEVELS }, (_, i) => (
                <circle
                  key={i}
                  cx={nodeX(i)} cy={nodeY(i)} r={5}
                  fill="#0a0a1c"
                  stroke="#00ffff" strokeWidth="1.5" strokeOpacity="0.28"
                />
              ))}
            </svg>

            {/* ═══ START Marker ═══ */}
            <div style={{
              position: 'absolute', top: PAD_T - 86, left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              opacity: mounted ? undefined : 0,
              animation: mounted ? 'neon-flicker-in 0.9s 0.05s both' : 'none',
            }}>
              <div style={{
                background: '#0a001e',
                border: '3px solid #ff00ff',
                padding: '8px 24px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                color: '#ff00ff',
                textShadow: '0 0 10px #ff00ff, 2px 2px 0 #000',
                boxShadow: '0 0 18px #ff00ff65, 4px 4px 0 #000',
                letterSpacing: '4px',
              }}>
                ▶ START
              </div>
              {/* Blinking down arrow */}
              <div style={{
                color: '#ff00ff',
                fontSize: '0.8rem',
                textShadow: '0 0 8px #ff00ff',
                animation: 'pink-pulse 1.2s ease-in-out infinite',
              }}>
                ↓
              </div>
            </div>

            {/* ═══ Vinyl Level Nodes ═══ */}
            {songs.map((song, i) => {
              const status = getStatus(song.id);
              const nx = nodeX(i);
              const ny = nodeY(i);
              const delay = appearDelay(ny);
              const isHovered = hoveredLevel === song.id;
              const halfNode = VINYL_NODE_SIZE / 2;  // 46
              const tooltipLeft = nx > SW / 2 ? -176 : 82;

              return (
                <div
                  key={song.id}
                  style={{
                    position: 'absolute',
                    left: nx - halfNode,
                    top: ny - halfNode,
                    zIndex: 10,
                    opacity: mounted ? undefined : 0,
                    animation: mounted ? `neon-flicker-in 0.65s ${delay}s both` : 'none',
                  }}
                  onMouseEnter={() => setHoveredLevel(song.id)}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  <VinylNode
                    levelId={song.id}
                    status={status}
                    onClick={status !== 'locked' ? () => navigate(`/quiz/${song.id}`) : undefined}
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      left: tooltipLeft,
                      top: -6,
                      zIndex: 30,
                      background: '#04040e',
                      border: `2px solid ${
                        status === 'completed' ? '#00ff88'
                        : status === 'unlocked'  ? '#00ffff'
                        : '#3a3a5e'
                      }`,
                      padding: '8px 12px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '0.38rem',
                      color: status === 'completed' ? '#00ff88'
                           : status === 'unlocked'  ? '#00ffff'
                           : '#4a4a6e',
                      boxShadow: '3px 3px 0 #000',
                      minWidth: 165, maxWidth: 200,
                      lineHeight: 1.9,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}>
                      {status === 'locked' ? (
                        '🔒 关卡已锁定'
                      ) : status === 'completed' ? (
                        <>✓ {song.title}<br />{song.artist}</>
                      ) : (
                        <>第 {song.id} 关<br />▶ 点击开始!</>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ═══ Progress Legend (Footer) ═══ */}
            <div style={{
              position: 'absolute', bottom: 52, left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
              zIndex: 15,
            }}>
              {[
                { color: '#00ff88', label: '已完成' },
                { color: '#00ffff', label: '已解锁' },
                { color: '#3a3a5e', label: '已锁定' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.42rem', color: item.color,
                  background: '#03030e',
                  border: `2px solid ${item.color}55`,
                  padding: '5px 10px',
                  boxShadow: '2px 2px 0 #000',
                }}>
                  <div className="pixel-circle" style={{
                    width: 10, height: 10,
                    background: item.color,
                    boxShadow: `0 0 5px ${item.color}`,
                  }} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Bottom FINISH marker */}
            <div style={{
              position: 'absolute', bottom: 110, left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 15,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.42rem',
              color: '#444466',
              textShadow: '1px 1px 0 #000',
              textAlign: 'center',
              letterSpacing: '2px',
            }}>
              ─ ─ ─ LEVEL 50 ─ ─ ─
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}