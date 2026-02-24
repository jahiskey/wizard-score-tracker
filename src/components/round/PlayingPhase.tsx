import { Icon, PrimaryButton } from '@fluentui/react';
import type { Dispatch } from 'react';
import type { GameAction } from '../../game/reducer';
import type { GameState } from '../../game/model';
import { getCurrentRound } from '../../game/selectors';

type PlayingPhaseProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function PlayingPhase({ state, dispatch }: PlayingPhaseProps) {
  const round = getCurrentRound(state);
  if (!round) return null;

  const players = state.players.slice().sort((a, b) => a.seatIndex - b.seatIndex);

  return (
    <div className="rounded-2xl border border-felt-700/60 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Playing Phase</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-900/60">
          At-a-glance bids
        </span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {players.map((player) => {
          const bid = round.bids[player.id];
          const isDealer = player.seatIndex === round.dealerSeatIndex;
          return (
            <div
              key={player.id}
              className={`rounded-2xl border px-5 py-4 shadow-md ${
                isDealer
                  ? 'border-gold-500/70 bg-gold-500/10'
                  : 'border-ink-900/10 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{player.name}</p>
                {isDealer && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-xs font-semibold text-gold-500">
                    <Icon iconName="Crown" /> Dealer
                  </span>
                )}
              </div>
              <p className="mt-3 text-4xl font-semibold text-ink-900">
                {bid ?? '--'}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <PrimaryButton
          className="rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 hover:bg-gold-400"
          onClick={() => dispatch({ type: 'START_SCORING' })}
        >
          Score This Round
        </PrimaryButton>
      </div>
    </div>
  );
}
