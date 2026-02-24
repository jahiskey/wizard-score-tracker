import type { GameState, Player, RoundEntry } from '../../game/model';
import { getCumulativeScores, getCurrentRound } from '../../game/selectors';

type ScoreboardTableProps = {
  state: GameState;
};

const sortPlayers = (players: Player[]) => players.slice().sort((a, b) => a.seatIndex - b.seatIndex);

const formatScore = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export function ScoreboardTable({ state }: ScoreboardTableProps) {
  const players = sortPlayers(state.players);
  const totals = getCumulativeScores(state);
  const currentRound = getCurrentRound(state);
  const leaderScore = Math.max(...players.map((player) => totals[player.id] ?? 0), 0);
  const hasScores = state.phase === 'gameComplete' || state.rounds.some((round) => round.finalized);
  const leaders = new Set(
    players
      .filter((player) => totals[player.id] === leaderScore && hasScores)
      .map((p) => p.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-cream-50">Scoreboard</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-cream-100/70">
          Round-by-round totals
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-felt-700/60 bg-felt-900/40">
        <table className="w-full text-left text-sm text-cream-50">
          <thead className="bg-felt-800/80 text-xs uppercase tracking-[0.2em] text-cream-100">
            <tr>
              <th className="px-3 py-2">Round</th>
              {players.map((player) => (
                <th
                  key={player.id}
                  className={`px-3 py-2 ${leaders.has(player.id) ? 'text-gold-400' : ''}`}
                >
                  {player.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.rounds.map((round) => (
              <ScoreboardRow
                key={round.roundNumber}
                round={round}
                players={players}
                isCurrent={currentRound?.roundNumber === round.roundNumber}
                leaders={leaders}
              />
            ))}
          </tbody>
        </table>
      </div>
      {state.phase === 'gameComplete' && leaders.size > 0 && (
        <div className="rounded-lg border border-gold-500/60 bg-gold-500/10 px-4 py-3 text-sm text-cream-50">
          Game complete. Leading score: {leaderScore}
        </div>
      )}
    </div>
  );
}

type ScoreboardRowProps = {
  round: RoundEntry;
  players: Player[];
  isCurrent: boolean;
  leaders: Set<string>;
};

function ScoreboardRow({ round, players, isCurrent, leaders }: ScoreboardRowProps) {
  return (
    <tr className={isCurrent ? 'bg-felt-700/40' : 'bg-transparent'}>
      <td className="px-3 py-2 font-semibold text-cream-100">{round.roundNumber}</td>
      {players.map((player) => {
        const delta = round.scoresDelta?.[player.id];
        const total = round.scoresTotal?.[player.id];
        return (
          <td
            key={player.id}
            className={`px-3 py-2 ${leaders.has(player.id) ? 'text-gold-400' : ''}`}
          >
            {delta === undefined || total === undefined ? (
              <span className="text-cream-100/50">--</span>
            ) : (
              <div className="flex flex-col">
                <span className="text-xs">{formatScore(delta)}</span>
                <span className="text-sm font-semibold">{total}</span>
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}
