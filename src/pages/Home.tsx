import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Disc3 } from 'lucide-react'

export default function Home() {
  return (
    <div
      className="page-bg flex min-h-dvh flex-col items-center justify-center gap-14 px-8"
      style={{ backgroundImage: 'url(/assets/homepage-bg.png)' }}
    >
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

      <motion.nav
        className="flex w-full max-w-xs flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Link
          to="/levels"
          className="btn-pixel w-full justify-center py-4 text-lg"
        >
          <Gamepad2 className="h-6 w-6 flex-shrink-0" />
          开始游戏
        </Link>
        <Link
          to="/collection"
          className="btn-pixel btn-pixel-pink w-full justify-center py-4 text-lg"
        >
          <Disc3 className="h-6 w-6 flex-shrink-0" />
          我的 CD 架
        </Link>
      </motion.nav>
    </div>
  )
}
