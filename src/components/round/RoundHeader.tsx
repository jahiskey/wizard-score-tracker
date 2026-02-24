import { Icon } from '@fluentui/react';
import type { GameState, RoundEntry } from '../../game/model';
import { getDealerPlayer } from '../../game/selectors';

type RoundHeaderProps = {
  state: GameState;
  round: RoundEntry;
};

export function RoundHeader({ state, round }: RoundHeaderProps) {
  const dealer = getDealerPlayer(state);

  return (
    <div className="rounded-2xl border border-felt-700/60 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-900/60">
            Wizard Card Game - Deluxe Edition (Special 2s)
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            Round {round.roundNumber} of {state.maxRounds}
          </h2>
          <p className="mt-1 text-sm text-ink-900/70">
            {round.roundNumber} cards dealt this round
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gold-500/50 bg-gold-500/15 px-4 py-3">
          <Icon iconName="Contact" className="text-gold-500" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-900/60">
              Dealer
            </p>
            <p className="text-sm font-semibold">
              {dealer?.name ?? 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
