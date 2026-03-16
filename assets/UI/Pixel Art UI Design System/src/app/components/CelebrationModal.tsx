import React, { useEffect, useState } from 'react';
import { PixelButton } from './PixelButton';
import { Trophy, Star } from 'lucide-react';

interface CelebrationModalProps {
  type: 'level' | 'allComplete';
  score?: number;
  onNext?: () => void;
  onHome?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

export function CelebrationModal({ type, score, onNext, onHome }: CelebrationModalProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800', '#00ff88'];
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[i % colors.length],
      size: Math.floor(Math.random() * 6) + 4,
      delay: Math.random() * 1000,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 6px ${p.color}`,
            animationName: 'float-up',
            animationDuration: '2s',
            animationDelay: `${p.delay}ms`,
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
          }}
        />
      ))}

      <div
        className="modal-in"
        style={{
          background: '#0d0d2b',
          border: type === 'allComplete' ? '4px solid #ff00ff' : '4px solid #00ffff',
          boxShadow:
            type === 'allComplete'
              ? '8px 8px 0 #000, 0 0 30px #ff00ff80'
              : '8px 8px 0 #000, 0 0 30px #00ffff80',
          padding: '40px',
          maxWidth: '480px',
          width: '90%',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Corner pixels */}
        {[
          { top: 0, left: 0 },
          { top: 0, right: 0 },
          { bottom: 0, left: 0 },
          { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: type === 'allComplete' ? '#ff00ff' : '#00ffff',
              ...pos,
            }}
          />
        ))}

        {type === 'allComplete' ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <Trophy
                size={48}
                color="#ffff00"
                style={{ filter: 'drop-shadow(0 0 10px #ffff00)', margin: '0 auto' }}
              />
            </div>
            <h2
              style={{
                color: '#ffff00',
                textShadow: '3px 3px 0 #000, 0 0 20px #ffff00',
                marginBottom: '8px',
                fontSize: '1rem',
              }}
            >
              🎉 全关卡达成！
            </h2>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.6rem',
                color: '#ccccff',
                marginBottom: '24px',
                lineHeight: '1.8',
              }}
            >
              恭喜你完成了所有关卡！
              <br />
              你是真正的音乐达人！
            </p>
            {score !== undefined && (
              <div
                className="score-badge"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  marginBottom: '24px',
                  fontSize: '0.8rem',
                }}
              >
                最终积分: {score}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <PixelButton variant="yellow" size="md" onClick={onHome}>
                返回首页
              </PixelButton>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  color="#ffff00"
                  fill="#ffff00"
                  style={{
                    filter: 'drop-shadow(0 0 6px #ffff00)',
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            <h2
              style={{
                color: '#00ffff',
                textShadow: '3px 3px 0 #000, 0 0 20px #00ffff',
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}
            >
              回答正确！
            </h2>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.55rem',
                color: '#00ff88',
                marginBottom: '8px',
              }}
            >
              +10 积分
            </p>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.5rem',
                color: '#8888cc',
              }}
            >
              2秒后自动加载下一关…
            </p>
          </>
        )}
      </div>
    </div>
  );
}
