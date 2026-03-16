import React from 'react';
import bgImage from 'figma:asset/858eccc21478690bfe5dbebae88a1cb6275491ec.png';

interface LayoutProps {
  children: React.ReactNode;
  showBg?: boolean;
}

export function Layout({ children, showBg = false }: LayoutProps) {
  return (
    <div
      className="crt-flicker"
      style={{
        minHeight: '100vh',
        background: '#0d0d2b',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pixel background */}
      {showBg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
          }}
        >
          <img
            src={bgImage}
            alt="background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              imageRendering: 'pixelated',
              opacity: 0.35,
            }}
          />
          {/* Dark gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(13,13,43,0.6) 0%, rgba(13,13,43,0.4) 50%, rgba(13,13,43,0.7) 100%)',
            }}
          />
        </div>
      )}

      {/* Scanlines */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
