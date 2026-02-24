import { TOTAL_CARDS, type PlayerId } from './model';

export function getMaxRounds(numPlayers: number): number {
  return Math.floor(TOTAL_CARDS / numPlayers);
}

export function getDealerSeatIndex(
  roundNumber: number,
  numPlayers: number,
  firstDealerSeatIndex: number
): number {
  return (firstDealerSeatIndex + roundNumber - 1) % numPlayers;
}

export function computePlayerScore(bid: number, tricks: number): number {
  if (bid === tricks) {
    return 20 + 10 * tricks;
  }
  return -10 * Math.abs(bid - tricks);
}

export function computeRoundScores(
  bids: Record<PlayerId, number>,
  tricks: Record<PlayerId, number>
): Record<PlayerId, number> {
  const scores: Record<PlayerId, number> = {};
  for (const playerId of Object.keys(bids)) {
    scores[playerId] = computePlayerScore(bids[playerId], tricks[playerId]);
  }
  return scores;
}
