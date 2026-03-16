import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { PixelButton } from '../components/PixelButton';
import { useGame } from '../context/GameContext';
import { Music, Disc3, RotateCcw } from 'lucide-react';
import bgImage from 'figma:asset/858eccc21478690bfe5dbebae88a1cb6275491ec.png';

export function Home() {
  const navigate = useNavigate();
  const { score, completedLevels, resetGame } = useGame();
  const [titleGlow, setTitleGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTitleGlow(v => !v), 1200);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    if (confirm('确定要重置所有进度吗？（积分和关卡进度将全部清零）')) {
      resetGame();
    }
  };

  return (
    <Layout showBg={false}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* Background image (full bleed, stronger at home) */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
          }}
        >
          <img
            src={bgImage}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(13,13,43,0.5) 0%, rgba(13,13,43,0.3) 40%, rgba(13,13,43,0.7) 100%)',
            }}
          />
        </div>

        {/* Title block */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          {/* Pixel decorative line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  background: i % 2 === 0 ? '#ff00ff' : '#00ffff',
                  boxShadow: `0 0 6px ${i % 2 === 0 ? '#ff00ff' : '#00ffff'}`,
                }}
              />
            ))}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.6rem',
              color: '#ff00ff',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '16px',
              textShadow: '2px 2px 0 #000, 0 0 10px #ff00ff',
            }}
          >
            ▶ MUSIC QUIZ GAME ◀
          </div>

          {/* Main title */}
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 8vw, 3.5rem)',
              color: titleGlow ? '#00ffff' : '#ffffff',
              textShadow: titleGlow
                ? '4px 4px 0 #000, 0 0 20px #00ffff, 0 0 40px #00ffff60'
                : '4px 4px 0 #000, 0 0 10px #00ffff40',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease',
              marginBottom: '0',
              lineHeight: 1.2,
            }}
          >
            PIXEL GUESS
          </h1>

          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(0.8rem, 3vw, 1.2rem)',
              color: '#ff00ff',
              textShadow: '2px 2px 0 #000, 0 0 10px #ff00ff',
              marginTop: '8px',
              letterSpacing: '0.2em',
            }}
          >
            像素猜歌
          </div>

          {/* Decorative line bottom */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
                  boxShadow: `0 0 6px ${i % 2 === 0 ? '#00ffff' : '#ff00ff'}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Score display */}
        {score > 0 && (
          <div
            className="score-badge"
            style={{
              marginBottom: '32px',
              padding: '10px 24px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#ffff00' }}>★</span>
            <span>积分: {score}</span>
            <span style={{ color: '#8888cc', fontSize: '0.55rem' }}>
              ({completedLevels.length} 关已通)
            </span>
          </div>
        )}

        {/* Menu buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          <PixelButton
            variant="cyan"
            size="xl"
            glow
            style={{ width: '100%' }}
            onClick={() => navigate('/levels')}
          >
            <Music size={16} />
            开始猜歌
          </PixelButton>

          <PixelButton
            variant="pink"
            size="xl"
            glow
            style={{ width: '100%' }}
            onClick={() => navigate('/collection')}
          >
            <Disc3 size={16} />
            我的 CD 架
          </PixelButton>

          {completedLevels.length > 0 && (
            <PixelButton
              variant="gray"
              size="md"
              style={{ width: '100%' }}
              onClick={handleReset}
            >
              <RotateCcw size={12} />
              重置进度
            </PixelButton>
          )}
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.45rem',
            color: '#333366',
          }}
        >
          50 LEVELS · GUESS THE SONG · COLLECT CDs
        </div>
      </div>
    </Layout>
  );
}