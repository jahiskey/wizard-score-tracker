import { PrimaryButton } from '@fluentui/react';
import type { GameState, Player } from '../game/model';
import { getCumulativeScores } from '../game/selectors';
import { ScoreboardTable } from './scoreboard/ScoreboardTable';

type GameCompleteProps = {
  state: GameState;
  onNewGame: () => void;
};

type Standing = {
  player: Player;
  total: number;
};

export function GameComplete({ state, onNewGame }: GameCompleteProps) {
  const totals = getCumulativeScores(state);
  const standings: Standing[] = state.players
    .map((player) => ({ player, total: totals[player.id] ?? 0 }))
    .sort((a, b) => b.total - a.total);

  const winner = standings[0];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gold-500/60 bg-cream-50 p-6 text-ink-900 shadow-xl shadow-black/30">
        <h2 className="text-2xl font-semibold">Game Complete</h2>
        <p className="mt-2 text-lg">
          Winner: <span className="font-semibold">{winner?.player.name ?? 'TBD'}</span>
        </p>
        <div className="mt-6 grid gap-3">
          {standings.map((standing, index) => (
            <div
              key={standing.player.id}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                index === 0
                  ? 'border-gold-500/70 bg-gold-500/15'
                  : 'border-ink-900/10 bg-white'
              }`}
            >
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-ink-900/60">Rank {index + 1}</p>
                <p className="text-lg font-semibold">{standing.player.name}</p>
              </div>
              <p className="text-xl font-semibold">{standing.total}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <PrimaryButton
            className="rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-900 shadow-md shadow-black/20 hover:bg-gold-400"
            onClick={onNewGame}
          >
            New Game
          </PrimaryButton>
        </div>
      </div>
      <div className="rounded-2xl border border-felt-700/60 bg-felt-800/70 p-4 shadow-lg shadow-black/30">
        <ScoreboardTable state={state} />
      </div>
    </section>
  );
}
