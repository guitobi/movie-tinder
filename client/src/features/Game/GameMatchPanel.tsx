import { MessageCircleHeart } from "lucide-react";

interface GameMatchPanelProps {
  title: string;
  description: string;
  status: string;
  nextStep: string;
}

const GameMatchPanel = ({
  title,
  description,
  status,
  nextStep,
}: GameMatchPanelProps) => {
  return (
    <section className="movie-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.25em]">
        Поточний match
      </p>
      <div className="mt-3 rounded-2xl border border-pink-500/20 bg-linear-to-br from-pink-500/10 via-purple-500/10 to-slate-950/40 p-4 sm:mt-4 sm:rounded-[28px] sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-black text-white sm:text-2xl">
              {title}
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-300 sm:mt-2 sm:text-sm sm:leading-6">
              {description}
            </p>
          </div>
          <div className="rounded-xl bg-pink-500/20 p-2.5 text-pink-200 sm:rounded-2xl sm:p-3">
            <MessageCircleHeart className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>

        <div className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-1">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Статус
            </p>
            <p className="mt-1.5 text-base font-bold text-white sm:mt-2 sm:text-lg">
              {status}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Наступний крок
            </p>
            <p className="mt-1.5 text-base font-bold text-white sm:mt-2 sm:text-lg">
              {nextStep}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameMatchPanel;
