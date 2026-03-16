import { useState, useCallback } from 'react';

export interface HintState {
  artist?: boolean;
  length?: boolean;
  firstChar?: boolean;
}

export interface GameState {
  score: number;
  completedLevels: number[];
  purchasedHints: Record<number, HintState>;
}

const STORAGE_KEY = 'pixelGuess_v1';

const defaultState: GameState = {
  score: 0,
  completedLevels: [],
  purchasedHints: {},
};

function loadState(): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultState, ...parsed };
    }
  } catch {}
  return { ...defaultState };
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const isUnlocked = useCallback(
    (levelId: number) => levelId === 1 || state.completedLevels.includes(levelId - 1),
    [state.completedLevels]
  );

  const isCompleted = useCallback(
    (levelId: number) => state.completedLevels.includes(levelId),
    [state.completedLevels]
  );

  const getHints = useCallback(
    (levelId: number): HintState => state.purchasedHints[levelId] ?? {},
    [state.purchasedHints]
  );

  const completeLevel = useCallback(
    (levelId: number) => {
      updateState(prev => {
        if (prev.completedLevels.includes(levelId)) return prev;
        return {
          ...prev,
          score: prev.score + 10,
          completedLevels: [...prev.completedLevels, levelId],
        };
      });
    },
    [updateState]
  );

  const purchaseHint = useCallback(
    (levelId: number, type: keyof HintState, cost: number): boolean => {
      let canAfford = false;
      updateState(prev => {
        if (prev.score < cost) return prev;
        canAfford = true;
        const existingHints = prev.purchasedHints[levelId] ?? {};
        if (existingHints[type]) return prev; // Already purchased
        return {
          ...prev,
          score: prev.score - cost,
          purchasedHints: {
            ...prev.purchasedHints,
            [levelId]: { ...existingHints, [type]: true },
          },
        };
      });
      return canAfford;
    },
    [updateState]
  );

  const skipLevel = useCallback(
    (levelId: number): boolean => {
      let canAfford = false;
      updateState(prev => {
        if (prev.score < 50) return prev;
        canAfford = true;
        return {
          ...prev,
          score: prev.score - 50,
          completedLevels: prev.completedLevels.includes(levelId)
            ? prev.completedLevels
            : [...prev.completedLevels, levelId],
        };
      });
      return canAfford;
    },
    [updateState]
  );

  const resetGame = useCallback(() => {
    updateState(() => ({ ...defaultState }));
  }, [updateState]);

  return {
    score: state.score,
    completedLevels: state.completedLevels,
    purchasedHints: state.purchasedHints,
    isUnlocked,
    isCompleted,
    getHints,
    completeLevel,
    purchaseHint,
    skipLevel,
    resetGame,
  };
}
