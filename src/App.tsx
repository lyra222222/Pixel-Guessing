import { useEffect } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import LevelMap from '@/pages/LevelMap'
import Quiz from '@/pages/Quiz'
import Collection from '@/pages/Collection'
import Settings from '@/pages/Settings'
import { DEFAULT_LANGUAGE } from '@/data/levels'
import { useGameState } from '@/hooks/useGameState'

export default function App() {
  const { currentLanguage } = useGameState()

  useEffect(() => {
    document.documentElement.lang = currentLanguage ?? DEFAULT_LANGUAGE
  }, [currentLanguage])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/levels" element={<LevelMap />} />
      <Route path="/quiz/:levelId" element={<Quiz />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
