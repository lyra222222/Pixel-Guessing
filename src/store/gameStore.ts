import { LEVELS } from '@/data/levels'

const STORAGE_KEY = 'pixel-guess-state'
const LEVEL_ORDER = LEVELS.map((l) => l.id)

export interface GameState {
  unlockedLevelIds: string[]
  completedLevelIds: string[]
  score: number
  purchasedHints: Record<string, { artist?: boolean; firstChar?: boolean }>
  purchasedShopIds: string[]
  /** 关卡地图上节点自定义位置，key 为 levelId，值为 0~1 相对坐标 */
  levelNodePositions: Record<string, { x: number; y: number }>
}

/** 按当前视图保存的关卡节点位置（0~1 相对容器），来自拖拽结果 */
const defaultLevelNodePositions: Record<string, { x: number; y: number }> = {
  '1': { x: 0.16, y: 0.86 },
  '2': { x: 0.18332, y: 0.756955 },
  '3': { x: 0.245816, y: 0.671193 },
  '4': { x: 0.336296, y: 0.597778 },
  '5': { x: 0.443567, y: 0.53177 },
  '6': { x: 0.556433, y: 0.46823 },
  '7': { x: 0.663704, y: 0.402222 },
  '8': { x: 0.754184, y: 0.328807 },
  '9': { x: 0.81668, y: 0.243045 },
  '10': { x: 0.84, y: 0.14 },
}

const defaultState: GameState = {
  unlockedLevelIds: ['1'],
  completedLevelIds: [],
  score: 0,
  purchasedHints: {},
  purchasedShopIds: [],
  levelNodePositions: defaultLevelNodePositions,
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultState }
    const parsed = JSON.parse(raw) as Partial<GameState>
    return {
      unlockedLevelIds: parsed.unlockedLevelIds ?? defaultState.unlockedLevelIds,
      completedLevelIds: parsed.completedLevelIds ?? defaultState.completedLevelIds,
      score: parsed.score ?? defaultState.score,
      purchasedHints: parsed.purchasedHints ?? defaultState.purchasedHints,
      purchasedShopIds: parsed.purchasedShopIds ?? defaultState.purchasedShopIds,
      levelNodePositions: parsed.levelNodePositions ?? defaultState.levelNodePositions,
    }
  } catch {
    return { ...defaultState }
  }
}

function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

let state = loadState()
const listeners = new Set<() => void>()

export function getState(): GameState {
  return state
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach((l) => l())
}

/** 重置进度：回到第一关、清空积分与提示等 */
export function resetProgress(): void {
  state = { ...defaultState }
  saveState(state)
  emit()
}

export function unlockNextLevel(currentLevelId: string): void {
  const i = LEVEL_ORDER.indexOf(currentLevelId)
  if (i === -1) return
  const nextId = LEVEL_ORDER[i + 1]
  if (!nextId || state.unlockedLevelIds.includes(nextId)) return
  state = { ...state, unlockedLevelIds: [...state.unlockedLevelIds, nextId] }
  saveState(state)
  emit()
}

export function completeLevel(levelId: string): void {
  if (state.completedLevelIds.includes(levelId)) return
  state = {
    ...state,
    completedLevelIds: [...state.completedLevelIds, levelId],
    score: state.score + 10,
  }
  saveState(state)
  emit()
}

export function purchaseHint(levelId: string, type: 'artist' | 'firstChar'): boolean {
  const cost = type === 'artist' ? 5 : 10
  if (state.score < cost) return false
  const current = state.purchasedHints[levelId] ?? {}
  if (type === 'artist' && current.artist) return false
  if (type === 'firstChar' && current.firstChar) return false
  state = {
    ...state,
    score: state.score - cost,
    purchasedHints: { ...state.purchasedHints, [levelId]: { ...current, [type]: true } },
  }
  saveState(state)
  emit()
  return true
}

export function purchaseShopItem(itemId: string, price: number): boolean {
  if (state.score < price || state.purchasedShopIds.includes(itemId)) return false
  state = { ...state, score: state.score - price, purchasedShopIds: [...state.purchasedShopIds, itemId] }
  saveState(state)
  emit()
  return true
}

/** 设置单个关卡节点位置（0~1），用于拖拽后保存 */
export function setLevelNodePosition(levelId: string, point: { x: number; y: number }): void {
  state = {
    ...state,
    levelNodePositions: { ...state.levelNodePositions, [levelId]: point },
  }
  saveState(state)
  emit()
}

/** 批量设置关卡节点位置（用于导入/恢复你保存的布局） */
export function setLevelNodePositions(positions: Record<string, { x: number; y: number }>): void {
  state = { ...state, levelNodePositions: { ...positions } }
  saveState(state)
  emit()
}
