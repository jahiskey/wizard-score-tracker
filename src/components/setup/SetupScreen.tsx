import { useMemo, useState, type Dispatch } from 'react';
import { PrimaryButton } from '@fluentui/react';
import type { GameAction } from '../../game/reducer';
import { MAX_PLAYERS, MIN_PLAYERS } from '../../game/model';
import type { GameState } from '../../game/model';

type SetupScreenProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function SetupScreen({ state, dispatch }: SetupScreenProps) {
  const [numPlayers, setNumPlayers] = useState<number>(state.numPlayers || 0);
  const [names, setNames] = useState<string[]>(() => Array.from({ length: MAX_PLAYERS }, () => ''));

  const playerSlots = useMemo(
    () => Array.from({ length: MAX_PLAYERS }, (_, index) => index),
    []
  );

  const trimmedNames = names.map((name) => name.trim());
  const canStart =
    numPlayers >= MIN_PLAYERS &&
    numPlayers <= MAX_PLAYERS &&
    trimmedNames.slice(0, numPlayers).every((name) => name.length > 0);

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
  };

  const handleStartGame = () => {
    if (!canStart) return;
    dispatch({
      type: 'SETUP_GAME',
      payload: {
        numPlayers,
        players: trimmedNames.slice(0, numPlayers).map((name) => ({ name })),
      },
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-felt-700/70 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
        <h2 className="text-xl font-semibold">Set up the table</h2>
        <p className="mt-1 text-sm text-ink-900/70">Pick your seat count and enter player names.</p>
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-900/70">
            Step 1. Number of players
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, index) => {
              const count = MIN_PLAYERS + index;
              const isSelected = count === numPlayers;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setNumPlayers(count)}
                  className={`rounded-xl border px-4 py-3 text-lg font-semibold shadow-sm transition ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500 text-ink-900'
                      : 'border-ink-900/10 bg-cream-100 text-ink-900 hover:border-gold-400'
                  }`}
                >
                  {count} Players
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-900/70">
            Step 2. Player names
          </h3>
          <div className="mt-4 grid gap-3">
            {playerSlots.map((index) => {
              const value = names[index];
              const isActive = index < numPlayers;
              const showError = isActive && value.trim().length === 0;
              return (
                <label
                  key={index}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                    isActive ? 'border-ink-900/10 bg-white' : 'border-ink-900/5 bg-cream-100/50'
                  }`}
                >
                  <span className="text-sm font-semibold text-ink-900/70">
                    Seat {index + 1}
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => handleNameChange(index, event.target.value)}
                    disabled={!isActive}
                    placeholder={isActive ? `Player ${index + 1}` : 'Add more players to unlock'}
                    className={`ml-3 flex-1 rounded-lg border px-3 py-2 text-base text-ink-900 placeholder:text-ink-900/40 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                      showError ? 'border-red-400' : 'border-ink-900/10'
                    }`}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-ink-900/60">
            Seats 1-{numPlayers || MIN_PLAYERS} will be used.
          </p>
          <PrimaryButton
            className={`rounded-lg px-5 py-3 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 ${
              canStart ? 'bg-gold-500 hover:bg-gold-400' : 'bg-cream-100 text-ink-900/40'
            }`}
            onClick={handleStartGame}
            disabled={!canStart}
          >
            Start Game
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
