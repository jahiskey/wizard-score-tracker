export function isValidBid(bid: number | null, roundNumber: number): boolean {
  if (bid === null) return false;
  return Number.isInteger(bid) && bid >= 0 && bid <= roundNumber;
}

export function isValidTricks(tricks: number | null, roundNumber: number): boolean {
  if (tricks === null) return false;
  return Number.isInteger(tricks) && tricks >= 0 && tricks <= roundNumber;
}

export function tricksSumValid(
  tricks: Record<string, number | null>,
  roundNumber: number
): boolean {
  const values = Object.values(tricks);
  if (values.some((v) => v === null)) return false;
  const sum = values.reduce<number>((acc, v) => acc + (v as number), 0);
  return sum === roundNumber;
}

export function allBidsEntered(bids: Record<string, number | null>): boolean {
  return Object.values(bids).every((b) => b !== null);
}

export function allTricksEntered(tricks: Record<string, number | null>): boolean {
  return Object.values(tricks).every((t) => t !== null);
}
