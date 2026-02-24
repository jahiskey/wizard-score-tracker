export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  seatIndex: number; // 0-based
}

export type Phase =
  | "setup"
  | "bidding"
  | "playing"
  | "scoring"
  | "roundComplete"
  | "gameComplete";

export interface RoundEntry {
  roundNumber: number; // 1-based
  dealerSeatIndex: number; // rotates each round
  bids: Record<PlayerId, number | null>;
  tricks: Record<PlayerId, number | null>;
  scoresDelta: Record<PlayerId, number> | null;
  scoresTotal: Record<PlayerId, number> | null;
  finalized: boolean;
}

export interface GameState {
  version: number;
  edition: "deluxe";
  numPlayers: number;
  players: Player[];
  firstDealerSeatIndex: number; // randomly chosen at game start
  maxRounds: number; // 60 / numPlayers
  currentRoundIndex: number; // 0-based
  phase: Phase;
  rounds: RoundEntry[];
  createdAtIso: string;
  updatedAtIso: string;
}

export const TOTAL_CARDS = 60;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 6;
