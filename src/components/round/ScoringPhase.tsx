import { PrimaryButton } from '@fluentui/react';
import type { Dispatch } from 'react';
import type { GameAction } from '../../game/reducer';
import type { GameState } from '../../game/model';
import { getCurrentRound, isAllTricksComplete, isTricksSumValid } from '../../game/selectors';
import { computePlayerScore } from '../../game/rules';
import { isValidTricks } from '../../game/validation';

const parseNumberInput = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

type ScoringPhaseProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function ScoringPhase({ state, dispatch }: ScoringPhaseProps) {
  const round = getCurrentRound(state);
  if (!round) return null;

  const players = state.players.slice().sort((a, b) => a.seatIndex - b.seatIndex);
  const tricksValues = Object.values(round.tricks);
  const tricksSum = tricksValues.reduce<number>((acc, value) => acc + (value ?? 0), 0);
  const allComplete = isAllTricksComplete(state);
  const sumValid = isTricksSumValid(state);

  const handleTricksChange = (playerId: string, value: string) => {
    const tricks = parseNumberInput(value);
    dispatch({ type: 'SET_TRICKS', payload: { playerId, tricks } });
  };

  return (
    <div className="rounded-2xl border border-felt-700/60 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-semibold">Scoring Phase</h3>
        <div className="text-sm text-ink-900/70">
          {tricksSum} of {round.roundNumber} tricks accounted for
        </div>
      </div>
      {allComplete && !sumValid && (
        <div className="mt-3 rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700">
          Total tricks must equal {round.roundNumber} before finalizing.
        </div>
      )}
      <div className="mt-6 grid gap-4">
        {players.map((player) => {
          const bid = round.bids[player.id];
          const tricks = round.tricks[player.id];
          const tricksValid = isValidTricks(tricks, round.roundNumber);
          const canScorePreview = bid !== null && tricks !== null && tricksValid;
          const preview = canScorePreview ? computePlayerScore(bid, tricks) : null;

          return (
            <div
              key={player.id}
              className="grid gap-3 rounded-xl border border-ink-900/10 bg-white px-4 py-3 shadow-sm sm:grid-cols-[1.4fr_0.8fr_1fr_0.8fr]"
            >
              <div>
                <p className="text-lg font-semibold">{player.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-900/60">Bid</p>
                <p className="text-base font-semibold">{bid ?? '--'}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-ink-900/60">
                  Tricks
                </label>
                <input
                  type="number"
                  min={0}
                  max={round.roundNumber}
                  value={tricks ?? ''}
                  onChange={(event) => handleTricksChange(player.id, event.target.value)}
                  className={`h-12 w-24 rounded-lg border text-center text-lg font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    tricksValid ? 'border-ink-900/10' : 'border-red-400'
                  }`}
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-900/60">Preview</p>
                <p className="text-2xl font-semibold">
                  {preview === null ? '--' : preview > 0 ? `+${preview}` : preview}
                </p>
              </div>
              <div className="text-right sm:text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-900/60">Dealer</p>
                <p className="text-sm font-semibold">
                  {player.seatIndex === round.dealerSeatIndex ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <PrimaryButton
          className={`rounded-lg px-6 py-3 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 ${
            allComplete && sumValid
              ? 'bg-gold-500 hover:bg-gold-400'
              : 'bg-cream-100 text-ink-900/40'
          }`}
          disabled={!allComplete || !sumValid}
          onClick={() => dispatch({ type: 'FINALIZE_ROUND' })}
        >
          Finalize Round
        </PrimaryButton>
      </div>
    </div>
  );
}
