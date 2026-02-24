import { useEffect, useReducer, useRef, type Dispatch } from 'react';
import { PrimaryButton } from '@fluentui/react';
import { gameReducer, initialGameState, type GameAction } from './game/reducer';
import type { GameState } from './game/model';
import { clearGameState, loadGameState, saveGameState } from './game/persistence';
import { SetupScreen } from './components/setup/SetupScreen';
import { RoundScreen } from './components/round/RoundScreen';
import { GameComplete } from './components/GameComplete';

const SAVE_DEBOUNCE_MS = 300;

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const loadAttemptedRef = useRef(false);

  useEffect(() => {
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;
    const loaded = loadGameState();
    if (loaded) {
      dispatch({ type: 'LOAD_GAME', payload: { state: loaded } });
    }
  }, []);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      saveGameState(state);
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [state]);

  const handleNewGame = () => {
    const confirmed = window.confirm('Start a new game? This will clear the current scorecard.');
    if (!confirmed) return;
    clearGameState();
    dispatch({ type: 'NEW_GAME' });
  };

  const renderPhase = (currentState: GameState, currentDispatch: Dispatch<GameAction>) => {
    switch (currentState.phase) {
      case 'setup':
        return <SetupScreen state={currentState} dispatch={currentDispatch} />;
      case 'bidding':
      case 'playing':
      case 'scoring':
      case 'roundComplete':
        return <RoundScreen state={currentState} dispatch={currentDispatch} />;
      case 'gameComplete':
        return <GameComplete state={currentState} onNewGame={handleNewGame} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-felt-900 text-cream-50">
      <header className="border-b border-felt-700/60 bg-felt-800/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-wide">Wizard Card Game</h1>
              <span className="rounded-full border border-gold-400/70 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Deluxe Edition
              </span>
            </div>
            <p className="mt-1 text-sm text-cream-100/80">Score Tracker for the Deluxe ruleset</p>
          </div>
          <PrimaryButton
            className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 hover:bg-gold-400"
            onClick={handleNewGame}
          >
            New Game
          </PrimaryButton>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-6">
        {renderPhase(state, dispatch)}
      </main>
    </div>
  );
}
