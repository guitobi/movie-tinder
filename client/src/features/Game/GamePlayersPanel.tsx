import { Check, Crown, Users } from "lucide-react";

interface GamePlayerItem {
  id: string;
  name: string;
  state: string;
  isHost: boolean;
}

interface GamePlayersPanelProps {
  players: GamePlayerItem[];
  onlineCount: string;
}

const GamePlayersPanel = ({ players, onlineCount }: GamePlayersPanelProps) => {
  return (
    <section className="movie-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.25em]">
            Команда
          </p>
          <h3 className="mt-1.5 flex items-center gap-2 text-xl font-bold text-white sm:mt-2 sm:text-2xl">
            <Users className="h-4 w-4 text-purple-300 sm:h-5 sm:w-5" />
            Реакції гравців
          </h3>
        </div>
        <div className="rounded-full bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-200 sm:px-3 sm:text-sm">
          {onlineCount}
        </div>
      </div>

      <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-purple-500/10 bg-slate-950/35 p-2.5 transition-all hover:border-purple-500/25 sm:rounded-2xl sm:p-3"
          >
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-sm font-bold text-white sm:h-11 sm:w-11 sm:text-base">
                {player.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {player.name}
                  </p>
                  {player.isHost && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 sm:px-2 sm:text-[11px]">
                      <Crown className="h-3 w-3" />
                      Host
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-400 sm:text-sm">
                  {player.state}
                </p>
              </div>
            </div>

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 sm:h-8 sm:w-8">
              <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GamePlayersPanel;
