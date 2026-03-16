import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../components/Layout';
import { PixelButton } from '../components/PixelButton';
import { useGame } from '../context/GameContext';
import { songs } from '../data/songs';
import { Home, Disc3, Star, Play } from 'lucide-react';

export function Collection() {
  const navigate = useNavigate();
  const { score, completedLevels } = useGame();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const collectedSongs = songs.filter(s => completedLevels.includes(s.id));

  return (
    <Layout>
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d2b',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#111133',
            borderBottom: '3px solid #2a2a6e',
            boxShadow: '0 4px 0 #000',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <PixelButton variant="dark" size="sm" onClick={() => navigate('/')}>
            <Home size={12} />
            返回首页
          </PixelButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Disc3
              size={16}
              color="#ff00ff"
              style={{ filter: 'drop-shadow(0 0 6px #ff00ff)' }}
            />
            <h2
              style={{
                fontSize: '0.75rem',
                margin: 0,
                color: '#ff00ff',
              }}
            >
              我的 CD 架
            </h2>
          </div>

          <div
            className="score-badge"
            style={{
              padding: '8px 16px',
              fontSize: '0.55rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Star size={10} fill="#ffff00" color="#ffff00" />
            {score} PTS
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: '24px',
          }}
        >
          {collectedSongs.length === 0 ? (
            // Empty state
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                gap: '24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  border: '4px solid #2a2a6e',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Disc3 size={32} color="#2a2a6e" />
              </div>
              <div>
                <h3
                  style={{
                    color: '#333366',
                    fontSize: '0.7rem',
                    marginBottom: '12px',
                  }}
                >
                  收藏架空空如也
                </h3>
                <p
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.5rem',
                    color: '#222255',
                    lineHeight: 1.8,
                  }}
                >
                  答对关卡即可收藏像素 CD！
                </p>
              </div>
              <PixelButton variant="cyan" size="md" glow onClick={() => navigate('/levels')}>
                开始猜歌
              </PixelButton>
            </div>
          ) : (
            <>
              {/* Stats bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    background: '#111133',
                    border: '3px solid #ff00ff',
                    padding: '10px 20px',
                    boxShadow: '3px 3px 0 #000, 0 0 8px #ff00ff40',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.6rem',
                    color: '#ff00ff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                    {collectedSongs.length}
                  </div>
                  <div style={{ opacity: 0.7 }}>已收藏</div>
                </div>
                <div
                  style={{
                    background: '#111133',
                    border: '3px solid #00ffff',
                    padding: '10px 20px',
                    boxShadow: '3px 3px 0 #000, 0 0 8px #00ffff40',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.6rem',
                    color: '#00ffff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                    {songs.length - collectedSongs.length}
                  </div>
                  <div style={{ opacity: 0.7 }}>待收藏</div>
                </div>
              </div>

              {/* CD Gallery Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '20px',
                  maxWidth: '900px',
                  margin: '0 auto',
                }}
              >
                {collectedSongs.map(song => (
                  <div
                    key={song.id}
                    onMouseEnter={() => setHoveredId(song.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/quiz/${song.id}`)}
                    style={{
                      background: '#111133',
                      border: '3px solid #2a2a6e',
                      boxShadow:
                        hoveredId === song.id
                          ? '6px 6px 0 #000, 0 0 16px #ff00ff60'
                          : '4px 4px 0 #000',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.15s, transform 0.1s, border-color 0.15s',
                      transform: hoveredId === song.id ? 'translate(-2px,-2px)' : 'none',
                      borderColor: hoveredId === song.id ? '#ff00ff' : '#2a2a6e',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* CD Image */}
                    <div style={{ position: 'relative', aspectRatio: '1/1' }}>
                      <img
                        src={song.image}
                        alt={song.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          imageRendering: 'pixelated',
                          display: 'block',
                          filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
                        }}
                      />

                      {/* CD vinyl overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(circle at center, rgba(0,0,0,0.3) 20%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Level badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: '#0d0d2b',
                          border: '2px solid #00ff88',
                          padding: '2px 6px',
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '0.4rem',
                          color: '#00ff88',
                          boxShadow: '2px 2px 0 #000',
                        }}
                      >
                        #{song.id}
                      </div>

                      {/* Play icon on hover */}
                      {hoveredId === song.id && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.4)',
                          }}
                        >
                          <Play
                            size={32}
                            color="#ffffff"
                            fill="#ffffff"
                            style={{ filter: 'drop-shadow(0 0 8px #fff)' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Info panel */}
                    <div
                      style={{
                        padding: '10px 10px 12px',
                        borderTop: '2px solid #1a1a4e',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', 'Courier New', monospace",
                          fontSize: '0.55rem',
                          color: '#ffffff',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textShadow: '1px 1px 0 #000',
                        }}
                      >
                        {song.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: '0.45rem',
                          color: '#8888cc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {song.artist}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to levels CTA */}
              {collectedSongs.length < songs.length && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    paddingBottom: '32px',
                  }}
                >
                  <PixelButton variant="cyan" size="lg" glow onClick={() => navigate('/levels')}>
                    继续收集更多 CD！
                  </PixelButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
