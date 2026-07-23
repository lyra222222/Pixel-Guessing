import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Gamepad2, Disc3, Languages } from 'lucide-react'
import { getCopy } from '@/data/copy'
import { LANGUAGE_OPTIONS } from '@/data/levels'
import { clearLanguageSelection, selectLanguage } from '@/store/gameStore'
import { useGameState } from '@/hooks/useGameState'

export default function Home() {
  const { currentLanguage } = useGameState()
  const copy = getCopy(currentLanguage)

  return (
    <div
      className="page-bg relative flex min-h-dvh flex-col items-center justify-center gap-14 px-8"
      style={{ backgroundImage: 'url(/assets/homepage-bg.png)' }}
    >
      {currentLanguage && (
        <button
          type="button"
          className="btn-pixel btn-pixel-sm absolute left-4 top-4 h-11 w-11 justify-center p-0"
          onClick={clearLanguageSelection}
          aria-label={copy.backToLanguageSelect}
          title={copy.backToLanguageSelect}
        >
          <ArrowLeft className="h-5 w-5 flex-shrink-0" />
        </button>
      )}

      <motion.h1
        className="font-pixel text-center text-4xl font-bold tracking-wide text-[var(--text)] md:text-5xl"
        style={{
          textShadow:
            '0 0 24px rgba(103,232,249,0.4), 0 2px 0 rgba(26,26,46,0.9), 1px 1px 0 rgba(26,26,46,0.8)',
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Pixel Guessing
      </motion.h1>

      <motion.div
        className="flex w-full max-w-xs flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {!currentLanguage ? (
          <>
            <div className="flex justify-center text-neonCyan">
              <Languages className="h-8 w-8" />
            </div>
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                className="btn-pixel w-full justify-center py-4 text-lg"
                onClick={() => selectLanguage(option.code)}
              >
                {option.label}
              </button>
            ))}
          </>
        ) : (
          <>
            <Link
              to="/levels"
              className="btn-pixel w-full justify-center py-4 text-lg"
            >
              <Gamepad2 className="h-6 w-6 flex-shrink-0" />
              {copy.startGame}
            </Link>
            <Link
              to="/collection"
              className="btn-pixel btn-pixel-pink w-full justify-center py-4 text-lg"
            >
              <Disc3 className="h-6 w-6 flex-shrink-0" />
              {copy.myCdShelf}
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
