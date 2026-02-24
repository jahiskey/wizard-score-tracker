import {
  type GameState,
  type Phase,
  type Player,
  type PlayerId,
  type RoundEntry,
} from './model';
import { computeRoundScores, getDealerSeatIndex, getMaxRounds } from './rules';

export type GameAction =
  | {
      type: 'SETUP_GAME';
      payload: { players: { name: string }[]; numPlayers: number };
    }
  | { type: 'SET_BID'; payload: { playerId: PlayerId; bid: number | null } }
  | { type: 'CONFIRM_BIDS' }
  | { type: 'START_SCORING' }
  | {
      type: 'SET_TRICKS';
      payload: { playerId: PlayerId; tricks: number | null };
    }
  | { type: 'FINALIZE_ROUND' }
  | { type: 'LOAD_GAME'; payload: { state: GameState } }
  | { type: 'NEW_GAME' };

const VERSION = 1;

const nowIso = (): string => new Date().toISOString();

const createEmptyGameState = (): GameState => ({
  version: VERSION,
  edition: 'deluxe',
  numPlayers: 0,
  players: [],
  maxRounds: 0,
  currentRoundIndex: 0,
  phase: 'setup',
  rounds: [],
  createdAtIso: nowIso(),
  updatedAtIso: nowIso(),
});

const withUpdatedAt = (state: GameState): GameState => ({
  ...state,
  updatedAtIso: nowIso(),
});

const createPlayerList = (
  players: { name: string }[],
  numPlayers: number
): Player[] =>
  players.slice(0, numPlayers).map((player, index) => ({
    id: `player-${index}`,
    name: player.name,
    seatIndex: index,
  }));

const createNullRecord = (
  players: Player[],
  initialValue: number | null
): Record<PlayerId, number | null> => {
  const record: Record<PlayerId, number | null> = {};
  for (const player of players) {
    record[player.id] = initialValue;
  }
  return record;
};

const createRounds = (
  players: Player[],
  numPlayers: number,
  maxRounds: number
): RoundEntry[] => {
  const rounds: RoundEntry[] = [];
  for (let roundNumber = 1; roundNumber <= maxRounds; roundNumber += 1) {
    rounds.push({
      roundNumber,
      dealerSeatIndex: getDealerSeatIndex(roundNumber, numPlayers),
      bids: createNullRecord(players, null),
      tricks: createNullRecord(players, null),
      scoresDelta: null,
      scoresTotal: null,
      finalized: false,
    });
  }
  return rounds;
};

const createGameState = (payload: {
  players: { name: string }[];
  numPlayers: number;
}): GameState => {
  const players = createPlayerList(payload.players, payload.numPlayers);
  const maxRounds = getMaxRounds(payload.numPlayers);
  const createdAtIso = nowIso();

  return {
    version: VERSION,
    edition: 'deluxe',
    numPlayers: payload.numPlayers,
    players,
    maxRounds,
    currentRoundIndex: 0,
    phase: 'bidding',
    rounds: createRounds(players, payload.numPlayers, maxRounds),
    createdAtIso,
    updatedAtIso: createdAtIso,
  };
};

const updateRound = (
  state: GameState,
  roundIndex: number,
  round: RoundEntry
): GameState => {
  const rounds = state.rounds.slice();
  rounds[roundIndex] = round;
  return { ...state, rounds };
};

const recordsComplete = (
  record: Record<PlayerId, number | null>
): record is Record<PlayerId, number> =>
  Object.values(record).every((value) => value !== null);

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SETUP_GAME':
      return createGameState(action.payload);
    case 'SET_BID': {
      const round = state.rounds[state.currentRoundIndex];
      if (!round) return withUpdatedAt(state);

      const bids = { ...round.bids, [action.payload.playerId]: action.payload.bid };
      const nextState = updateRound(state, state.currentRoundIndex, {
        ...round,
        bids,
      });
      return withUpdatedAt(nextState);
    }
    case 'CONFIRM_BIDS':
      return withUpdatedAt({ ...state, phase: 'playing' });
    case 'START_SCORING':
      return withUpdatedAt({ ...state, phase: 'scoring' });
    case 'SET_TRICKS': {
      const round = state.rounds[state.currentRoundIndex];
      if (!round) return withUpdatedAt(state);

      const tricks = {
        ...round.tricks,
        [action.payload.playerId]: action.payload.tricks,
      };
      const nextState = updateRound(state, state.currentRoundIndex, {
        ...round,
        tricks,
      });
      return withUpdatedAt(nextState);
    }
    case 'FINALIZE_ROUND': {
      const roundIndex = state.currentRoundIndex;
      const round = state.rounds[roundIndex];
      if (!round) return withUpdatedAt(state);
      if (!recordsComplete(round.bids) || !recordsComplete(round.tricks)) {
        return withUpdatedAt(state);
      }

      const scoresDelta = computeRoundScores(
        round.bids as Record<PlayerId, number>,
        round.tricks as Record<PlayerId, number>
      );

      const previousTotals: Record<PlayerId, number> = {};
      const previousRound = state.rounds[roundIndex - 1];
      for (const player of state.players) {
        previousTotals[player.id] = previousRound?.scoresTotal?.[player.id] ?? 0;
      }

      const scoresTotal: Record<PlayerId, number> = {};
      for (const player of state.players) {
        scoresTotal[player.id] = previousTotals[player.id] + scoresDelta[player.id];
      }

      const updatedRound = {
        ...round,
        scoresDelta,
        scoresTotal,
        finalized: true,
      };

      const updatedState = updateRound(state, roundIndex, updatedRound);
      const isLastRound = roundIndex + 1 >= state.maxRounds;

      const nextState = {
        ...updatedState,
        currentRoundIndex: isLastRound ? roundIndex : roundIndex + 1,
        phase: (isLastRound ? 'gameComplete' : 'bidding') as Phase,
      };

      return withUpdatedAt(nextState);
    }
    case 'LOAD_GAME':
      return { ...action.payload.state, updatedAtIso: nowIso() };
    case 'NEW_GAME':
      return createEmptyGameState();
    default:
      return withUpdatedAt(state);
  }
}

export const initialGameState = createEmptyGameState();
