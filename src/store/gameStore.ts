import {
  DEFAULT_LANGUAGE,
  type GameLanguage,
  LANGUAGE_OPTIONS,
  getLevelsForLanguage,
} from '@/data/levels'
import { getLevelPathPoints } from '@/utils/levelMapPath'

const STORAGE_KEY = 'pixel-guess-state-v3'
const LEGACY_STORAGE_KEYS = ['pixel-guess-state', 'pixel-guess-state-v2']

type HintState = Record<string, { artist?: boolean; firstChar?: boolean }>

export interface LanguageProgress {
  unlockedLevelIds: string[]
  completedLevelIds: string[]
  score: number
  purchasedHints: HintState
  purchasedShopIds: string[]
  /** 关卡地图上节点自定义位置，key 为 levelId，值为 0~1 相对坐标 */
  levelNodePositions: Record<string, { x: number; y: number }>
}

export interface GameState {
  currentLanguage: GameLanguage | null
  progressByLanguage: Record<GameLanguage, LanguageProgress>
}

function createDefaultProgress(language: GameLanguage): LanguageProgress {
  const levels = getLevelsForLanguage(language)
  const defaultPathPoints = getLevelPathPoints(levels.length)
  const levelNodePositions: Record<string, { x: number; y: number }> = levels.reduce(
    (acc, level, index) => {
      acc[level.id] = defaultPathPoints[index]
      return acc
    },
    {} as Record<string, { x: number; y: number }>
  )

  return {
    unlockedLevelIds: ['1'],
    completedLevelIds: [],
    score: 0,
    purchasedHints: {},
    purchasedShopIds: [],
    levelNodePositions,
  }
}

const defaultProgressByLanguage = LANGUAGE_OPTIONS.reduce(
  (acc, option) => {
    acc[option.code] = createDefaultProgress(option.code)
    return acc
  },
  {} as Record<GameLanguage, LanguageProgress>
)

const defaultState: GameState = {
  currentLanguage: null,
  progressByLanguage: defaultProgressByLanguage,
}

function normalizeProgress(
  language: GameLanguage,
  progress?: Partial<LanguageProgress>
): LanguageProgress {
  const fallback = createDefaultProgress(language)

  return {
    unlockedLevelIds: progress?.unlockedLevelIds ?? fallback.unlockedLevelIds,
    completedLevelIds: progress?.completedLevelIds ?? fallback.completedLevelIds,
    score: progress?.score ?? fallback.score,
    purchasedHints: progress?.purchasedHints ?? fallback.purchasedHints,
    purchasedShopIds: progress?.purchasedShopIds ?? fallback.purchasedShopIds,
    levelNodePositions: progress?.levelNodePositions ?? fallback.levelNodePositions,
  }
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        try {
          localStorage.removeItem(key)
        } catch {
          // ignore
        }
      }
      return { ...defaultState }
    }

    const parsed = JSON.parse(raw) as Partial<GameState>
    const currentLanguage = parsed.currentLanguage ?? defaultState.currentLanguage
    const progressByLanguage = LANGUAGE_OPTIONS.reduce(
      (acc, option) => {
        acc[option.code] = normalizeProgress(
          option.code,
          parsed.progressByLanguage?.[option.code]
        )
        return acc
      },
      {} as Record<GameLanguage, LanguageProgress>
    )

    return {
      currentLanguage,
      progressByLanguage,
    }
  } catch {
    return { ...defaultState }
  }
}

function saveState(nextState: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
}

let state = loadState()
const listeners = new Set<() => void>()

export function getState(): GameState {
  return state
}

export function getCurrentLanguage(): GameLanguage | null {
  return state.currentLanguage
}

export function getActiveLanguage(): GameLanguage {
  return state.currentLanguage ?? DEFAULT_LANGUAGE
}

export function getCurrentProgress(): LanguageProgress {
  return state.progressByLanguage[getActiveLanguage()]
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach((l) => l())
}

function updateCurrentProgress(
  updater: (progress: LanguageProgress) => LanguageProgress
): void {
  const language = getActiveLanguage()
  state = {
    ...state,
    progressByLanguage: {
      ...state.progressByLanguage,
      [language]: updater(state.progressByLanguage[language]),
    },
  }
  saveState(state)
  emit()
}

export function selectLanguage(language: GameLanguage): void {
  state = { ...state, currentLanguage: language }
  saveState(state)
  emit()
}

export function clearLanguageSelection(): void {
  state = { ...state, currentLanguage: null }
  saveState(state)
  emit()
}

/** 重置当前语言进度：回到第一关、清空积分与提示等 */
export function resetProgress(): void {
  const language = getActiveLanguage()
  state = {
    ...state,
    progressByLanguage: {
      ...state.progressByLanguage,
      [language]: createDefaultProgress(language),
    },
  }
  saveState(state)
  emit()
}

export function unlockNextLevel(currentLevelId: string): void {
  const language = getActiveLanguage()
  const levelOrder = getLevelsForLanguage(language).map((l) => l.id)
  const i = levelOrder.indexOf(currentLevelId)
  if (i === -1) return
  const nextId = levelOrder[i + 1]
  const progress = state.progressByLanguage[language]
  if (!nextId || progress.unlockedLevelIds.includes(nextId)) return

  updateCurrentProgress((current) => ({
    ...current,
    unlockedLevelIds: [...current.unlockedLevelIds, nextId],
  }))
}

export function completeLevel(levelId: string): void {
  const progress = getCurrentProgress()
  if (progress.completedLevelIds.includes(levelId)) return

  updateCurrentProgress((current) => ({
    ...current,
    completedLevelIds: [...current.completedLevelIds, levelId],
    score: current.score + 10,
  }))
}

export function purchaseHint(levelId: string, type: 'artist' | 'firstChar'): boolean {
  const cost = type === 'artist' ? 5 : 10
  const progress = getCurrentProgress()
  if (progress.score < cost) return false
  const currentHint = progress.purchasedHints[levelId] ?? {}
  if (type === 'artist' && currentHint.artist) return false
  if (type === 'firstChar' && currentHint.firstChar) return false

  updateCurrentProgress((current) => ({
    ...current,
    score: current.score - cost,
    purchasedHints: {
      ...current.purchasedHints,
      [levelId]: { ...currentHint, [type]: true },
    },
  }))
  return true
}

export function purchaseShopItem(itemId: string, price: number): boolean {
  const progress = getCurrentProgress()
  if (progress.score < price || progress.purchasedShopIds.includes(itemId)) return false

  updateCurrentProgress((current) => ({
    ...current,
    score: current.score - price,
    purchasedShopIds: [...current.purchasedShopIds, itemId],
  }))
  return true
}

/** 设置当前语言的单个关卡节点位置（0~1），用于拖拽后保存 */
export function setLevelNodePosition(levelId: string, point: { x: number; y: number }): void {
  updateCurrentProgress((current) => ({
    ...current,
    levelNodePositions: { ...current.levelNodePositions, [levelId]: point },
  }))
}

/** 批量设置当前语言的关卡节点位置（用于导入/恢复你保存的布局） */
export function setLevelNodePositions(positions: Record<string, { x: number; y: number }>): void {
  updateCurrentProgress((current) => ({
    ...current,
    levelNodePositions: { ...positions },
  }))
}
