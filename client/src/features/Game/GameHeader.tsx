import { ArrowLeft, Popcorn, Sparkles } from "lucide-react";
import { Link } from "react-router";

interface GameHeaderProps {
  roomId?: string;
  cardProgress: string;
  matchState: string;
}

const GameHeader = ({ roomId, cardProgress, matchState }: GameHeaderProps) => {
  return (
    <header className="movie-card p-3 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <Link
            to={roomId ? `/rooms/${roomId}` : "/"}
            className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/70 text-slate-200 transition-all hover:scale-105 hover:bg-slate-800 sm:mt-1 sm:h-11 sm:w-11 sm:rounded-2xl"
            aria-label="Назад до кімнати"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>

          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-300/80 sm:mb-2 sm:gap-2 sm:text-sm sm:tracking-[0.35em]">
              <Popcorn className="h-4 w-4" />
              MovieMatch Session
            </div>
            <h1 className="text-2xl font-black text-white sm:text-4xl lg:text-5xl">
              Раунд вибору фільму
            </h1>
            <p className="mt-1.5 hidden max-w-2xl text-xs leading-5 text-slate-300 sm:mt-2 sm:block sm:text-base sm:leading-normal">
              Базовий екран гри: тут буде картка фільму, реакції гравців і
              фінальний матч, коли всі зійдуться на одному варіанті.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <div className="rounded-xl border border-purple-500/20 bg-slate-950/40 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Кімната
            </p>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              #{roomId ?? "ABCDE"}
            </p>
          </div>
          <div className="rounded-xl border border-purple-500/20 bg-slate-950/40 px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Картка
            </p>
            <p className="mt-1 text-base font-bold text-white sm:text-lg">
              {cardProgress}
            </p>
          </div>
          <div className="hidden rounded-xl border border-purple-500/20 bg-slate-950/40 px-3 py-2.5 sm:block sm:rounded-2xl sm:px-4 sm:py-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
              Match Ready
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-base font-bold text-emerald-400 sm:gap-2 sm:text-lg">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {matchState}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
