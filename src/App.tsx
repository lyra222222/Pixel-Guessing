import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import LevelMap from '@/pages/LevelMap'
import Quiz from '@/pages/Quiz'
import Collection from '@/pages/Collection'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/levels" element={<LevelMap />} />
      <Route path="/quiz/:levelId" element={<Quiz />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
