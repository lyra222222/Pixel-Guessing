import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mic, Type } from 'lucide-react'
import { HintPowerUpButton } from '@/components/HintPowerUpButton'
import { LEVELS } from '@/data/levels'
import { useGameState } from '@/hooks/useGameState'
import {
  completeLevel,
  unlockNextLevel,
  purchaseHint,
  getState,
} from '@/store/gameStore'

const CORRECT_DELAY_MS = 2000

const CORRECT_PARTICLE_COLORS = [
  '#00f5ff',
  '#ff6ec7',
  '#ffd700',
  '#39ff14',
  '#ff9500',
  '#e040fb',
]
const CORRECT_PARTICLE_SYMBOLS = ['✨', '★', '♪'] as const

type CorrectParticle = {
  id: number
  symbol: (typeof CORRECT_PARTICLE_SYMBOLS)[number]
  color: string
  angle: number
  distance: number
}

const COMBO_PARTICLE_SYMBOLS = ['✨', '★', '♪'] as const
const COMBO_PARTICLE_COLORS = ['#00f5ff', '#ffd700', '#ff6ec7', '#39ff14', '#ff9500', '#e040fb']

type ComboParticle = {
  id: number
  symbol: (typeof COMBO_PARTICLE_SYMBOLS)[number]
  color: string
  angle: number
  distance: number
}

const LEVEL_COMPLETE_COLORS = [
  '#ffd700', '#00f5ff', '#ff6ec7', '#39ff14', '#ff9500', '#e040fb', '#ffeb3b', '#00e676',
]

type LevelCompleteParticle = {
  id: number
  type: 'confetti' | 'sparkle' | 'note'
  color: string
  angle: number
  distance: number
  rot: number
}

/**
 * Show combo animation: "Nx Combo" text (scale in, bounce, glow) + pixel particles near center.
 * Stronger color/glow for higher combos. Call when comboCount >= 2.
 */
export function showComboAnimation(
  comboCount: number,
  setComboDisplay: React.Dispatch<React.SetStateAction<number | null>>,
  setComboParticles: React.Dispatch<React.SetStateAction<ComboParticle[]>>
) {
  const count = 8 + Math.min(comboCount, 5) * 2 + Math.floor(Math.random() * 4)
  const baseDistance = 50 + Math.min(comboCount, 4) * 12
  const particles: ComboParticle[] = Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i + 10000,
    symbol: COMBO_PARTICLE_SYMBOLS[Math.floor(Math.random() * COMBO_PARTICLE_SYMBOLS.length)],
    color: COMBO_PARTICLE_COLORS[Math.floor(Math.random() * COMBO_PARTICLE_COLORS.length)],
    angle: (Math.PI * 2 * i) / count + Math.random() * 0.6,
    distance: baseDistance + Math.random() * 40,
  }))
  setComboParticles(particles)
  setComboDisplay(comboCount)
  const duration = 1000
  setTimeout(() => {
    setComboParticles([])
    setComboDisplay(null)
  }, duration)
}

/**
 * Reusable correct-answer animation: scale + bounce, glow, pixel particles, floating "Correct!" text.
 * Call when the player selects the correct answer. Duration ~0.6–0.8s.
 */
export function playCorrectAnimation(
  setParticles: React.Dispatch<React.SetStateAction<CorrectParticle[]>>,
  setTrigger: React.Dispatch<React.SetStateAction<number>>,
  setShowCorrectText: React.Dispatch<React.SetStateAction<boolean>>
) {
  const count = 16 + Math.floor(Math.random() * 6)
  const particles: CorrectParticle[] = Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    symbol:
      CORRECT_PARTICLE_SYMBOLS[
        Math.floor(Math.random() * CORRECT_PARTICLE_SYMBOLS.length)
      ],
    color:
      CORRECT_PARTICLE_COLORS[
        Math.floor(Math.random() * CORRECT_PARTICLE_COLORS.length)
      ],
    angle: (Math.PI * 2 * i) / count + Math.random() * 0.6,
    distance: 75 + Math.random() * 55,
  }))
  setParticles(particles)
  setTrigger((t) => t + 1)
  setShowCorrectText(true)
  const duration = 950
  setTimeout(() => {
    setParticles([])
    setTrigger(0)
    setShowCorrectText(false)
  }, duration)
}

export default function Quiz() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const state = useGameState()
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showAllDone, setShowAllDone] = useState(false)
  const [correctAnimTrigger, setCorrectAnimTrigger] = useState(0)
  const [correctParticles, setCorrectParticles] = useState<CorrectParticle[]>([])
  const [showCorrectText, setShowCorrectText] = useState(false)
  const [comboCount, setComboCount] = useState(0)
  const [comboDisplay, setComboDisplay] = useState<number | null>(null)
  const [comboParticles, setComboParticles] = useState<ComboParticle[]>([])
  const [wrongAnimTrigger, setWrongAnimTrigger] = useState(0)
  const [showLevelComplete, setShowLevelComplete] = useState(false)
  const [levelCompleteParticles, setLevelCompleteParticles] = useState<LevelCompleteParticle[]>([])

  const playCorrect = useCallback(() => {
    playCorrectAnimation(
      setCorrectParticles,
      setCorrectAnimTrigger,
      setShowCorrectText
    )
  }, [])

  const level = LEVELS.find((l) => l.id === levelId)
  const currentIndex = levelId ? LEVELS.findIndex((l) => l.id === levelId) : -1
  const isLastLevel = currentIndex >= 0 && currentIndex === LEVELS.length - 1
  const hints = levelId ? state.purchasedHints[levelId] ?? {} : {}

  useEffect(() => {
    if (!level) return
    setInput('')
    setFeedback(null)
  }, [levelId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!level || !levelId) return
    const normalized = input.trim().toLowerCase().replace(/\s+/g, '')
    const answerNorm = level.answer.toLowerCase().replace(/\s+/g, '')
    if (normalized !== answerNorm) {
      setFeedback('wrong')
      setComboCount(0)
      setWrongAnimTrigger((t) => t + 1)
      setTimeout(() => setWrongAnimTrigger(0), 400)
      return
    }
    const nextCombo = comboCount + 1
    setComboCount(nextCombo)
    setFeedback('correct')
    playCorrect()
    if (nextCombo >= 2) {
      showComboAnimation(nextCombo, setComboDisplay, setComboParticles)
    }
    completeLevel(levelId)
    unlockNextLevel(levelId)

    // Level Complete celebration: start after a short delay (~400ms)
    setTimeout(() => {
      const confettiCount = 24
      const sparkleCount = 10
      const noteCount = 10
      const particles: LevelCompleteParticle[] = []
      let id = Date.now()
      for (let i = 0; i < confettiCount; i++) {
        particles.push({
          id: id++,
          type: 'confetti',
          color: LEVEL_COMPLETE_COLORS[Math.floor(Math.random() * LEVEL_COMPLETE_COLORS.length)],
          angle: (Math.PI * 2 * i) / confettiCount + Math.random() * 0.8,
          distance: 80 + Math.random() * 100,
          rot: (Math.random() - 0.5) * 720,
        })
      }
      for (let i = 0; i < sparkleCount; i++) {
        particles.push({
          id: id++,
          type: 'sparkle',
          color: LEVEL_COMPLETE_COLORS[Math.floor(Math.random() * LEVEL_COMPLETE_COLORS.length)],
          angle: (Math.PI * 2 * i) / sparkleCount + Math.random() * 0.5,
          distance: 60 + Math.random() * 80,
          rot: 0,
        })
      }
      for (let i = 0; i < noteCount; i++) {
        particles.push({
          id: id++,
          type: 'note',
          color: LEVEL_COMPLETE_COLORS[Math.floor(Math.random() * LEVEL_COMPLETE_COLORS.length)],
          angle: (Math.PI * 2 * i) / noteCount + Math.random() * 0.5,
          distance: 60 + Math.random() * 80,
          rot: 0,
        })
      }
      setLevelCompleteParticles(particles)
      setShowLevelComplete(true)
      setTimeout(() => {
        setShowLevelComplete(false)
        setLevelCompleteParticles([])
      }, 2000)
    }, 400)

    if (isLastLevel) {
      setTimeout(() => setShowAllDone(true), CORRECT_DELAY_MS)
    } else {
      const next = LEVELS[currentIndex + 1]
      setTimeout(() => navigate(`/quiz/${next.id}`), CORRECT_DELAY_MS)
    }
  }

  const buyArtist = () => {
    if (levelId && getState().score >= 5 && !hints.artist) {
      purchaseHint(levelId, 'artist')
    }
  }
  const buyFirstChar = () => {
    if (levelId && getState().score >= 10 && !hints.firstChar) {
      purchaseHint(levelId, 'firstChar')
    }
  }

  if (!level) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-navy p-4">
        <div className="text-center text-white">
          <p className="font-pixel mb-4">关卡不存在</p>
          <Link to="/levels" className="btn-pixel">
            返回关卡
          </Link>
        </div>
      </div>
    )
  }

  const firstChar = level.title.charAt(0)

  const comboGlowClass =
    comboDisplay === null
      ? ''
      : comboDisplay >= 4
        ? 'combo-glow-4'
        : comboDisplay === 3
          ? 'combo-glow-3'
          : 'combo-glow-2'

  return (
    <div
      className={`page-bg flex min-h-dvh flex-col bg-navy ${wrongAnimTrigger > 0 ? 'wrong-screen-shake' : ''}`}
      style={{ backgroundImage: 'url(/assets/otherpage-bg.png)' }}
    >
      {/* Level Complete celebration: particles overlay (banner shown below buttons) */}
      {showLevelComplete && (
        <div
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
          aria-hidden
        >
          {levelCompleteParticles.map((p) => {
            const tx = Math.cos(p.angle) * p.distance
            const ty = Math.sin(p.angle) * p.distance
            if (p.type === 'confetti') {
              return (
                <div
                  key={p.id}
                  className="level-complete-confetti absolute left-1/2 top-1/2"
                  style={
                    {
                      '--tx': `${tx}px`,
                      '--ty': `${ty}px`,
                      '--rot': `${p.rot}deg`,
                      width: 8,
                      height: 8,
                      marginLeft: -4,
                      marginTop: -4,
                      backgroundColor: p.color,
                      boxShadow: `0 0 6px ${p.color}`,
                    } as React.CSSProperties
                  }
                />
              )
            }
            return (
              <span
                key={p.id}
                className="level-complete-float absolute left-1/2 top-1/2 font-pixel text-2xl"
                style={
                  {
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    color: p.color,
                    textShadow: `0 0 10px ${p.color}`,
                  } as React.CSSProperties
                }
              >
                {p.type === 'sparkle' ? '✨' : '♪'}
              </span>
            )
          })}
        </div>
      )}

      {/* Combo overlay: center screen, floating text + particles */}
      {comboDisplay !== null && (
        <div
          className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
          aria-hidden
        >
          <span
            className={`combo-text-enter ${comboGlowClass} font-pixel text-4xl font-bold`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {comboDisplay}x Combo
          </span>
          {comboParticles.map((p) => {
            const tx = Math.cos(p.angle) * p.distance
            const ty = Math.sin(p.angle) * p.distance
            return (
              <span
                key={p.id}
                className="combo-particle absolute left-1/2 top-1/2 font-pixel text-xl"
                style={
                  {
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    color: p.color,
                    textShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                  } as React.CSSProperties
                }
              >
                {p.symbol}
              </span>
            )
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-pixel text-lg text-neonCyan">
          积分：<strong>{state.score}</strong>
        </span>
        <Link to="/levels" className="btn-pixel btn-pixel-sm">
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
          返回关卡
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pb-8">
        <p className="font-pixel mb-2 text-neonCyan">第 {level.id} 关</p>

        <div className="relative mb-5 inline-block">
          {/* Floating "Correct!" text above the card */}
          {showCorrectText && (
            <span
              className="correct-float-text pointer-events-none absolute left-1/2 top-0 z-20 font-pixel text-3xl font-bold"
              style={{
                color: '#39ff14',
                textShadow:
                  '0 0 12px #39ff14, 0 0 24px rgba(57,255,20,0.8), 0 3px 0 rgba(0,0,0,0.4), 3px 3px 0 #00f5ff, -1px -1px 0 rgba(0,0,0,0.3)',
              }}
            >
              Correct!
            </span>
          )}
          {/* Pixel particles: sparkles, stars, music notes */}
          {correctParticles.map((p) => {
            const tx = Math.cos(p.angle) * p.distance
            const ty = Math.sin(p.angle) * p.distance
            return (
              <span
                key={p.id}
                className="correct-particle pointer-events-none absolute left-1/2 top-1/2 z-10 font-pixel text-2xl"
                style={
                  {
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    color: p.color,
                    textShadow: `0 0 10px ${p.color}, 0 0 20px ${p.color}`,
                  } as React.CSSProperties
                }
              >
                {p.symbol}
              </span>
            )
          })}
          <motion.div
            className={`overflow-hidden rounded-xl border-4 border-[var(--primary)] shadow-panel ${correctAnimTrigger > 0 ? 'correct-card-pop correct-glow-outline' : ''} ${wrongAnimTrigger > 0 ? 'wrong-feedback-card' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'relative', zIndex: 5 }}
          >
            <img
              src={level.imageUrl}
              alt="猜歌图"
              className="h-48 w-48 object-cover md:h-64 md:w-64"
            />
          </motion.div>
        </div>

        {/* 已购买的提示展示 */}
        <div className="mb-3 flex flex-wrap justify-center gap-2 font-pixel text-sm">
          {hints.artist && (
            <span className="rounded border border-neonCyan px-2 py-0.5 text-neonCyan">
              歌手：{level.artist}
            </span>
          )}
          {hints.firstChar && (
            <span className="rounded border border-neonPink px-2 py-0.5 text-neonPink">
              首字：{firstChar}
            </span>
          )}
        </div>

        {/* 输入歌名 + 提交答案：紧贴图片下方 */}
        <form onSubmit={handleSubmit} className="relative mb-3 flex w-full max-w-sm flex-col gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入歌名"
            className={`font-pixel w-full rounded-lg border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text)] placeholder-text-muted focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 ${wrongAnimTrigger > 0 ? 'wrong-feedback-shake wrong-feedback-outline' : ''}`}
            autoComplete="off"
          />
          <button type="submit" className="btn-pixel w-full">
            提交答案
          </button>
        </form>

        {/* 提示 power-up 按钮：两行布局，主操作 + 消耗 */}
        <div className="flex flex-wrap justify-center gap-3">
          {!hints.artist && (
            <HintPowerUpButton
              mainLabel="提示歌手"
              costLabel="消耗 5 积分"
              icon={<Mic className="h-4 w-4 flex-shrink-0" />}
              disabled={state.score < 5}
              onClick={buyArtist}
              variant="standard"
            />
          )}
          {!hints.firstChar && (
            <HintPowerUpButton
              mainLabel="首字提示"
              costLabel="消耗 10 积分"
              icon={<Type className="h-4 w-4 flex-shrink-0" />}
              disabled={state.score < 10}
              onClick={buyFirstChar}
              variant="premium"
            />
          )}
        </div>

        {/* Level Complete! 显示在最后一行按钮的中间下方 */}
        {showLevelComplete && (
          <div className="mt-4 flex w-full justify-center">
            <span
              className="level-complete-banner level-complete-banner-glow font-pixel text-3xl font-bold md:text-4xl"
              style={{
                color: '#ffd700',
                textShadow: '0 2px 0 rgba(0,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.2)',
              }}
            >
              Level Complete!
            </span>
          </div>
        )}

        <AnimatePresence>
          {feedback === 'correct' && (
            <motion.p
              className="mt-4 font-pixel text-xl text-green-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              回答正确！+10 积分
            </motion.p>
          )}
          {feedback === 'wrong' && (
            <motion.p
              className="mt-4 font-pixel text-xl text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              答案不对，再试试
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAllDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAllDone(false)
              navigate('/')
            }}
          >
            <motion.div
              className="max-w-sm rounded-xl border-4 border-neonPink bg-navy p-8 text-center shadow-[0_0_24px_rgba(255,110,199,0.5)]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-pixel mb-4 text-2xl text-neonPink">全关卡达成！</h2>
              <p className="font-pixel text-neonCyan mb-6">恭喜你通关全部关卡</p>
              <button
                type="button"
                className="btn-pixel btn-pixel-pink"
                onClick={() => {
                  setShowAllDone(false)
                  navigate('/')
                }}
              >
                返回首页
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
