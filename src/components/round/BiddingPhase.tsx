import { Icon, PrimaryButton } from '@fluentui/react';
import type { Dispatch } from 'react';
import type { GameAction } from '../../game/reducer';
import type { GameState, Player } from '../../game/model';
import { getBiddingOrder, getCurrentRound } from '../../game/selectors';
import { isValidBid } from '../../game/validation';

const parseNumberInput = (value: string): number | null => {
  if (value.trim() === '') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

type BiddingPhaseProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function BiddingPhase({ state, dispatch }: BiddingPhaseProps) {
  const round = getCurrentRound(state);
  if (!round) return null;

  const biddingOrder = getBiddingOrder(state);

  const allValid = biddingOrder.every((player) =>
    isValidBid(round.bids[player.id], round.roundNumber)
  );

  const canConfirm = allValid && biddingOrder.every((player) => round.bids[player.id] !== null);

  const handleBidChange = (playerId: string, value: string) => {
    const bid = parseNumberInput(value);
    dispatch({ type: 'SET_BID', payload: { playerId, bid } });
  };

  const adjustBid = (player: Player, delta: number) => {
    const current = round.bids[player.id] ?? 0;
    const next = Math.min(round.roundNumber, Math.max(0, current + delta));
    dispatch({ type: 'SET_BID', payload: { playerId: player.id, bid: next } });
  };

  return (
    <div className="rounded-2xl border border-felt-700/60 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Bidding Phase</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-900/60">
          Dealer bids last
        </span>
      </div>
      <div className="mt-6 grid gap-4">
        {biddingOrder.map((player) => {
          const bid = round.bids[player.id];
          const isDealer = player.seatIndex === round.dealerSeatIndex;
          const isValid = isValidBid(bid, round.roundNumber);

          return (
            <div
              key={player.id}
              className={`flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3 shadow-sm ${
                isDealer
                  ? 'border-gold-500/70 bg-gold-500/10'
                  : 'border-ink-900/10 bg-white'
              }`}
            >
              <div className="min-w-[140px]">
                <p className="text-lg font-semibold">{player.name}</p>
                {isDealer && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-xs font-semibold text-gold-500">
                    <Icon iconName="Crown" /> Dealer
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustBid(player, -1)}
                  className="h-12 w-12 rounded-full border border-ink-900/10 bg-cream-100 text-xl font-semibold text-ink-900 shadow-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  max={round.roundNumber}
                  value={bid ?? ''}
                  onChange={(event) => handleBidChange(player.id, event.target.value)}
                  className={`h-12 w-24 rounded-lg border text-center text-lg font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                    isValid ? 'border-ink-900/10' : 'border-red-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => adjustBid(player, 1)}
                  className="h-12 w-12 rounded-full border border-ink-900/10 bg-cream-100 text-xl font-semibold text-ink-900 shadow-sm"
                >
                  +
                </button>
              </div>
              <p className="ml-auto text-sm text-ink-900/60">Max {round.roundNumber}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-end">
        <PrimaryButton
          className={`rounded-lg px-6 py-3 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 ${
            canConfirm ? 'bg-gold-500 hover:bg-gold-400' : 'bg-cream-100 text-ink-900/40'
          }`}
          disabled={!canConfirm}
          onClick={() => dispatch({ type: 'CONFIRM_BIDS' })}
        >
          Confirm Bids
        </PrimaryButton>
      </div>
    </div>
  );
}
