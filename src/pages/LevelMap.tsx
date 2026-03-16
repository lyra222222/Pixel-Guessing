import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Lock } from 'lucide-react'
import { PixelPanel } from '@/components/PixelPanel'
import { useGameState } from '@/hooks/useGameState'
import { resetProgress } from '@/store/gameStore'
import { LEVELS } from '@/data/levels'
import { getLevelPathPoints } from '@/utils/levelMapPath'

type NodeStatus = 'locked' | 'unlocked' | 'completed'

/** 像素风格圆形：用 16 边形 + 锯齿感描边模拟低分辨率圆 */
function PixelCircleNode({
  levelId,
  status,
  index,
  point,
}: {
  levelId: string
  status: NodeStatus
  index: number
  point: { x: number; y: number }
}) {
  const navigate = useNavigate()
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const isLocked = status === 'locked'
  const isUnlocked = status === 'unlocked'
  const isCompleted = status === 'completed'

  const handleClick = () => {
    if (isLocked) return
    if (isUnlocked) {
      // 钢琴键按下反馈 + 像素音符粒子
      const count = 5 + Math.floor(Math.random() * 3)
      setParticles(
        Array.from({ length: count }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
        }))
      )
      setTimeout(() => setParticles([]), 600)
      setTimeout(() => navigate(`/quiz/${levelId}`), 180)
    }
  }

  const neonCyan = '#00f5ff'
  const neonGreen = '#39ff14'
  const neonPink = '#ff6ec7'

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{
        left: `${point.x * 100}%`,
        top: `${point.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        width: 72,
        height: 72,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
    >
      {/* 节奏跳动光晕（底部） */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          width: 80,
          height: 80,
          left: '50%',
          top: '50%',
          marginLeft: -40,
          marginTop: -40,
          background: isLocked
            ? 'transparent'
            : `radial-gradient(ellipse 60% 40% at 50% 85%, ${
                isCompleted ? 'rgba(255,110,199,0.5)' : 'rgba(0,245,255,0.5)'
              }, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: isLocked ? 0 : [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.button
        type="button"
        className="relative flex items-center justify-center overflow-visible rounded-full border-0 outline-none"
        style={{ width: 56, height: 56 }}
        onClick={handleClick}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.08 } : {}}
        whileTap={!isLocked ? { scale: 0.92 } : {}}
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* 外圈：等化器描边（像素锯齿感用多段描边模拟） */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 56 56"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            <filter id={`glow-${levelId}`}>
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`eq-${levelId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {isLocked ? (
                <>
                  <stop offset="0%" stopColor="#666" />
                  <stop offset="100%" stopColor="#444" />
                </>
              ) : isCompleted ? (
                <>
                  <stop offset="0%" stopColor={neonPink} />
                  <stop offset="100%" stopColor="#ff9ed9" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor={neonGreen} />
                  <stop offset="50%" stopColor={neonCyan} />
                  <stop offset="100%" stopColor={neonGreen} />
                </>
              )}
            </linearGradient>
          </defs>
          {/* 光滑圆形边缘 */}
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="rgba(0,0,0,0.98)"
            stroke={`url(#eq-${levelId})`}
            strokeWidth="3"
            filter={isLocked ? undefined : `url(#glow-${levelId})`}
          />
          {/* 等化器波动：虚线描边 */}
          {!isLocked && (
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke={`url(#eq-${levelId})`}
              strokeWidth="2"
              strokeDasharray="5 8"
              opacity="0.85"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="26"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>

        {/* 中心：数字严格居中，锁定态时锁图标在数字上方 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center justify-center">
            {isLocked && (
              <Lock
                className="h-5 w-5 text-gray-500 shrink-0 absolute left-1/2 -translate-x-1/2"
                style={{ bottom: '100%', marginBottom: 4 }}
                strokeWidth={2.5}
              />
            )}
            <span
              className="font-pixel text-lg font-bold tabular-nums block text-center min-w-[1.25em]"
              style={{
                color: isLocked ? '#888' : isCompleted ? neonPink : neonCyan,
                textShadow: isLocked ? 'none' : `0 0 8px ${isCompleted ? neonPink : neonCyan}`,
              }}
            >
              {levelId}
            </span>
          </div>
        </div>

        {/* 点击迸发：像素音符粒子 */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="pointer-events-none absolute font-pixel text-sm"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: neonCyan,
                textShadow: `0 0 6px ${neonCyan}`,
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.3,
                x: p.x * 1.8,
                y: p.y * 1.8,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              ♪
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

export default function LevelMap() {
  const navigate = useNavigate()
  const { unlockedLevelIds, completedLevelIds, score, levelNodePositions } = useGameState()
  const defaultPoints = useMemo(() => getLevelPathPoints(LEVELS.length), [])
  const pathPoints = useMemo(
    () =>
      LEVELS.map((level, index) => levelNodePositions[level.id] ?? defaultPoints[index]),
    [defaultPoints, levelNodePositions]
  )

  const handleReset = () => {
    resetProgress()
    navigate('/quiz/1')
  }

  const getStatus = (id: string): NodeStatus => {
    if (completedLevelIds.includes(id)) return 'completed'
    if (unlockedLevelIds.includes(id)) return 'unlocked'
    return 'locked'
  }

  return (
    <div
      className="relative min-h-dvh w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/assets/level1.png)' }}
    >
      {/* 顶栏：积分 + 操作（level selection menu） */}
      <div className="relative z-10 px-4 py-3">
        <PixelPanel compact>
          <div className="flex items-center justify-between gap-2">
            <span className="font-pixel text-lg text-neonCyan">
              积分：<strong>{score}</strong>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn-pixel btn-pixel-amber btn-pixel-sm"
              >
                重新开始
              </button>
              <Link to="/" className="btn-pixel btn-pixel-sm">
                <Home className="h-5 w-5 flex-shrink-0" />
                返回首页
              </Link>
            </div>
          </div>
        </PixelPanel>
      </div>

      {/* 关卡节点列表：沿 S 形路径绝对定位 */}
      <div className="absolute inset-0" style={{ marginTop: 0 }}>
        <div
          className="relative h-full w-full"
          style={{ minHeight: 'calc(100dvh - 56px)' }}
        >
          {LEVELS.map((level, index) => (
            <PixelCircleNode
              key={level.id}
              levelId={level.id}
              status={getStatus(level.id)}
              index={index}
              point={pathPoints[index]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
