import type { Dispatch } from 'react';
import type { GameAction } from '../../game/reducer';
import type { GameState } from '../../game/model';
import { getCurrentRound } from '../../game/selectors';
import { RoundHeader } from './RoundHeader';
import { BiddingPhase } from './BiddingPhase';
import { PlayingPhase } from './PlayingPhase';
import { ScoringPhase } from './ScoringPhase';
import { ScoreboardTable } from '../scoreboard/ScoreboardTable';

type RoundScreenProps = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function RoundScreen({ state, dispatch }: RoundScreenProps) {
  const round = getCurrentRound(state);
  if (!round) return null;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <RoundHeader state={state} round={round} />
        {state.phase === 'bidding' && <BiddingPhase state={state} dispatch={dispatch} />}
        {state.phase === 'playing' && <PlayingPhase state={state} dispatch={dispatch} />}
        {state.phase === 'scoring' && <ScoringPhase state={state} dispatch={dispatch} />}
      </div>
      <aside className="rounded-2xl border border-felt-700/60 bg-felt-800/70 p-4 shadow-lg shadow-black/30">
        <ScoreboardTable state={state} />
      </aside>
    </section>
  );
}
