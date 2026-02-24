import type { GameState } from './model';

const STORAGE_KEY = 'wizard-score-tracker:v1';

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail
  }
}

export function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return null;
    return parsed as GameState;
  } catch {
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
