import { useSyncExternalStore } from 'react'
import { getCurrentProgress, getState, subscribe } from '@/store/gameStore'

export function useGameState() {
  return useSyncExternalStore(subscribe, getState, getState)
}

export function useCurrentProgress() {
  useSyncExternalStore(subscribe, getState, getState)
  return getCurrentProgress()
}
