import { useSyncExternalStore } from 'react'
import { getState, subscribe } from '@/store/gameStore'

export function useGameState() {
  return useSyncExternalStore(subscribe, getState, getState)
}
