import type { GameState, Player, PlayerId, RoundEntry } from './model';
import { allBidsEntered, allTricksEntered, tricksSumValid } from './validation';

export function getCurrentRound(state: GameState): RoundEntry | null {
  return state.rounds[state.currentRoundIndex] ?? null;
}

export function getDealerPlayer(state: GameState): Player | null {
  const round = getCurrentRound(state);
  if (!round) return null;
  return state.players.find((player) => player.seatIndex === round.dealerSeatIndex) ?? null;
}

export function getCumulativeScores(state: GameState): Record<PlayerId, number> {
  const totals: Record<PlayerId, number> = {};
  for (const player of state.players) {
    totals[player.id] = 0;
  }

  for (const round of state.rounds) {
    if (!round.finalized || !round.scoresDelta) continue;
    for (const [playerId, score] of Object.entries(round.scoresDelta)) {
      totals[playerId] = (totals[playerId] ?? 0) + score;
    }
  }

  return totals;
}

export function getBiddingOrder(state: GameState): Player[] {
  const round = getCurrentRound(state);
  const ordered = state.players.slice().sort((a, b) => a.seatIndex - b.seatIndex);
  if (!round) return ordered;

  const dealerIndex = ordered.findIndex(
    (player) => player.seatIndex === round.dealerSeatIndex
  );
  if (dealerIndex === -1) return ordered;

  return ordered
    .slice(dealerIndex + 1)
    .concat(ordered.slice(0, dealerIndex + 1));
}

export function isAllBidsComplete(state: GameState): boolean {
  const round = getCurrentRound(state);
  if (!round) return false;
  return allBidsEntered(round.bids);
}

export function isAllTricksComplete(state: GameState): boolean {
  const round = getCurrentRound(state);
  if (!round) return false;
  return allTricksEntered(round.tricks);
}

export function isTricksSumValid(state: GameState): boolean {
  const round = getCurrentRound(state);
  if (!round) return false;
  return tricksSumValid(round.tricks, round.roundNumber);
}
