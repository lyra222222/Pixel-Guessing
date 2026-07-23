import { Link } from 'react-router-dom'
import { PixelPanel } from '@/components/PixelPanel'
import { Home, Volume2, Languages } from 'lucide-react'
import { getCopy } from '@/data/copy'
import { useGameState } from '@/hooks/useGameState'

export default function Settings() {
  const { currentLanguage } = useGameState()
  const copy = getCopy(currentLanguage)

  return (
    <div className="min-h-dvh bg-navy p-4">
      <div className="mb-4">
        <PixelPanel compact>
          <div className="flex items-center justify-between">
            <span className="font-pixel text-lg text-neonCyan">{copy.settingsTitle}</span>
            <Link to="/" className="btn-pixel btn-pixel-sm">
              <Home className="h-5 w-5 flex-shrink-0" />
              {copy.backHome}
            </Link>
          </div>
        </PixelPanel>
      </div>

      <PixelPanel title="Settings">
        <ul className="font-pixel space-y-3 text-gray-300">
          <li className="flex items-center gap-3 rounded-lg border-2 border-[var(--border)] bg-[var(--bg)] px-3 py-2">
            <Volume2 className="h-5 w-5 flex-shrink-0 text-neonCyan" />
            <span>{copy.sound}</span>
          </li>
          <li className="flex items-center gap-3 rounded-lg border-2 border-[var(--border)] bg-[var(--bg)] px-3 py-2">
            <Languages className="h-5 w-5 flex-shrink-0 text-neonCyan" />
            <span>{copy.language}</span>
          </li>
        </ul>
      </PixelPanel>
    </div>
  )
}
