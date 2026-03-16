import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Layout } from '../components/Layout';
import { PixelButton } from '../components/PixelButton';
import { HintCapsule } from '../components/HintCapsule';
import { GuessInput } from '../components/GuessInput';
import { CelebrationModal } from '../components/CelebrationModal';
import { useGame } from '../context/GameContext';
import { songs, TOTAL_LEVELS } from '../data/songs';
import { ArrowLeft, Star, SkipForward, User, Hash, Type } from 'lucide-react';

type AnswerState = 'idle' | 'correct' | 'wrong';

export function Quiz() {
  const navigate = useNavigate();
  const { levelId: levelIdParam } = useParams<{ levelId: string }>();
  const levelId = parseInt(levelIdParam ?? '1', 10);

  const { score, isUnlocked, isCompleted, getHints, completeLevel, purchaseHint, skipLevel } =
    useGame();

  const [guess, setGuess] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showModal, setShowModal] = useState<'level' | 'allComplete' | null>(null);
  const [shake, setShake] = useState(false);
  const [skipConfirm, setSkipConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const song = songs.find(s => s.id === levelId);
  const hints = getHints(levelId);

  // Redirect if locked or not found
  useEffect(() => {
    if (!song || !isUnlocked(levelId)) {
      navigate('/levels');
    }
  }, [levelId, song, isUnlocked, navigate]);

  // Reset state when level changes
  useEffect(() => {
    setGuess('');
    setAnswerState('idle');
    setShake(false);
    setErrorMsg('');
    setSkipConfirm(false);
    setShowModal(null);
    setImgLoaded(false);
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [levelId]);

  if (!song) return null;

  const handleSubmit = () => {
    const normalized = guess.trim();
    if (!normalized) return;

    if (normalized === song.title) {
      // Correct!
      setAnswerState('correct');
      completeLevel(levelId);

      if (levelId >= TOTAL_LEVELS) {
        setShowModal('allComplete');
      } else {
        setShowModal('level');
        autoAdvanceTimerRef.current = setTimeout(() => {
          setShowModal(null);
          navigate(`/quiz/${levelId + 1}`);
        }, 2000);
      }
    } else {
      // Wrong
      setAnswerState('wrong');
      setShake(true);
      setErrorMsg('答案不对，再试试！');
      setTimeout(() => {
        setAnswerState('idle');
        setErrorMsg('');
      }, 1200);
    }
  };

  const handleBuyHint = (type: 'artist' | 'length' | 'firstChar', cost: number) => {
    if (hints[type]) return; // Already purchased
    const success = purchaseHint(levelId, type, cost);
    if (!success) {
      setErrorMsg(`积分不足！需要 ${cost} PTS`);
      setTimeout(() => setErrorMsg(''), 1500);
    }
  };

  const handleSkip = () => {
    if (!skipConfirm) {
      setSkipConfirm(true);
      setTimeout(() => setSkipConfirm(false), 3000);
      return;
    }
    const success = skipLevel(levelId);
    if (success) {
      if (levelId >= TOTAL_LEVELS) {
        setShowModal('allComplete');
      } else {
        navigate(`/quiz/${levelId + 1}`);
      }
    } else {
      setErrorMsg('积分不足！需要 50 PTS');
      setTimeout(() => setErrorMsg(''), 1500);
      setSkipConfirm(false);
    }
  };

  const hintValues = {
    artist: song.artist,
    length: `${song.title.length} 个字`,
    firstChar: song.title[0],
  };

  const alreadyCompleted = isCompleted(levelId);

  return (
    <Layout>
      <div
        style={{
          minHeight: '100vh',
          background: '#0d0d2b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            width: '100%',
            background: '#111133',
            borderBottom: '3px solid #2a2a6e',
            boxShadow: '0 4px 0 #000',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <PixelButton variant="dark" size="sm" onClick={() => navigate('/levels')}>
            <ArrowLeft size={12} />
            关卡列表
          </PixelButton>

          {/* Level indicator */}
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.6rem',
              color: '#00ffff',
              textShadow: '2px 2px 0 #000, 0 0 8px #00ffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ color: '#666688' }}>STAGE</span>
            <span>{levelId}</span>
            <span style={{ color: '#333366' }}>/</span>
            <span style={{ color: '#666688' }}>{TOTAL_LEVELS}</span>
          </div>

          <div
            className="score-badge"
            style={{
              padding: '6px 14px',
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

        {/* Quiz content */}
        <div
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '680px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Pixel image display area */}
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '1/1',
              background: '#111133',
              border: `4px solid ${alreadyCompleted ? '#00ff88' : '#00ffff'}`,
              boxShadow: alreadyCompleted
                ? '6px 6px 0 #000, 0 0 20px #00ff8860'
                : '6px 6px 0 #000, 0 0 20px #00ffff60',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Corner ornaments */}
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
                  width: '16px',
                  height: '16px',
                  background: alreadyCompleted ? '#00ff88' : '#00ffff',
                  zIndex: 2,
                  ...pos,
                }}
              />
            ))}

            <img
              src={song.image}
              alt={`关卡 ${levelId}`}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                imageRendering: 'pixelated',
                display: 'block',
                filter: `brightness(0.9) contrast(1.1) saturate(1.2)`,
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />

            {/* Loading state */}
            {!imgLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '0.55rem',
                  color: '#333366',
                }}
              >
                LOADING...
              </div>
            )}

            {/* Already completed badge */}
            {alreadyCompleted && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#003322',
                  border: '2px solid #00ff88',
                  padding: '4px 8px',
                  fontSize: '0.45rem',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#00ff88',
                  zIndex: 3,
                }}
              >
                ✓ 已通关
              </div>
            )}
          </div>

          {/* Hint capsules display area */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {hints.artist && (
              <HintCapsule type="artist" value={hintValues.artist} revealed />
            )}
            {hints.length && (
              <HintCapsule type="length" value={hintValues.length} revealed />
            )}
            {hints.firstChar && (
              <HintCapsule type="firstChar" value={hintValues.firstChar} revealed />
            )}
          </div>

          {/* Error / feedback message */}
          {errorMsg && (
            <div
              style={{
                background: '#330000',
                border: '2px solid #ff4444',
                padding: '8px 16px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.55rem',
                color: '#ff4444',
                boxShadow: '3px 3px 0 #000',
                textAlign: 'center',
              }}
            >
              ✗ {errorMsg}
            </div>
          )}

          {/* Guess input */}
          <div style={{ width: '100%' }}>
            <GuessInput
              value={guess}
              onChange={setGuess}
              onSubmit={handleSubmit}
              shake={shake}
              disabled={answerState === 'correct'}
              placeholder="输入歌名…"
            />
          </div>

          {/* Submit button */}
          <PixelButton
            variant="cyan"
            size="lg"
            glow
            style={{ width: '100%', maxWidth: '400px' }}
            disabled={!guess.trim() || answerState === 'correct'}
            onClick={handleSubmit}
          >
            ▶ 确认答案 (ENTER)
          </PixelButton>

          {/* Bottom action area */}
          <div
            style={{
              width: '100%',
              background: '#0a0a22',
              border: '3px solid #1a1a4e',
              boxShadow: '4px 4px 0 #000',
              padding: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hint section label */}
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.45rem',
                color: '#333366',
                marginBottom: '4px',
              }}
            >
              — 提示系统 —
            </div>

            {/* Artist hint */}
            <PixelButton
              variant={hints.artist ? 'gray' : 'pink'}
              size="sm"
              disabled={!!hints.artist}
              onClick={() => handleBuyHint('artist', 1)}
            >
              <User size={10} />
              {hints.artist ? '已购·歌手' : '歌手 -1 PTS'}
            </PixelButton>

            {/* Length hint */}
            <PixelButton
              variant={hints.length ? 'gray' : 'cyan'}
              size="sm"
              disabled={!!hints.length}
              onClick={() => handleBuyHint('length', 5)}
            >
              <Hash size={10} />
              {hints.length ? '已购·字数' : '字数 -5 PTS'}
            </PixelButton>

            {/* First char hint */}
            <PixelButton
              variant={hints.firstChar ? 'gray' : 'yellow'}
              size="sm"
              disabled={!!hints.firstChar}
              onClick={() => handleBuyHint('firstChar', 10)}
            >
              <Type size={10} />
              {hints.firstChar ? '已购·首字' : '首字 -10 PTS'}
            </PixelButton>

            {/* Divider */}
            <div
              style={{
                width: '3px',
                height: '32px',
                background: '#2a2a6e',
                margin: '0 4px',
              }}
            />

            {/* Skip button */}
            <PixelButton
              variant={skipConfirm ? 'red' : 'gray'}
              size="sm"
              onClick={handleSkip}
              glow={skipConfirm}
            >
              <SkipForward size={10} />
              {skipConfirm ? '再按确认跳过!' : '直接过关 -50 PTS'}
            </PixelButton>
          </div>

          {/* Answer hint for already completed */}
          {alreadyCompleted && (
            <div
              style={{
                background: '#002233',
                border: '2px solid #00ff88',
                padding: '12px 20px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.55rem',
                color: '#00ff88',
                textAlign: 'center',
                boxShadow: '3px 3px 0 #000',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              ♪ {song.title} — {song.artist}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal === 'level' && (
        <CelebrationModal
          type="level"
          score={score}
          onNext={() => {
            if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
            navigate(`/quiz/${levelId + 1}`);
          }}
        />
      )}
      {showModal === 'allComplete' && (
        <CelebrationModal
          type="allComplete"
          score={score}
          onHome={() => navigate('/')}
        />
      )}
    </Layout>
  );
}
