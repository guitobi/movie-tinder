import { useState } from "react";

type WinnerMovieProps = {
  hasWinnerMovie: boolean;
  winnerMovie: {
    id: number;
    title: string;
    overview?: string;
    vote_average: number;
    release_date?: string;
    backdrop_path?: string;
    poster_path?: string;
  };
  onClose: () => void;
};

const WinnerMovie = ({
  hasWinnerMovie,
  winnerMovie,
  onClose,
}: WinnerMovieProps) => {
  const [dismissedWinnerId, setDismissedWinnerId] = useState<number | null>(
    null,
  );
  const isWinnerOverlayOpen =
    winnerMovie.id !== 0 && winnerMovie.id !== dismissedWinnerId;

  const handleClose = () => {
    if (!winnerMovie.id) {
      return;
    }

    setDismissedWinnerId(winnerMovie.id);
    onClose();
  };

  return hasWinnerMovie && isWinnerOverlayOpen ? (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-3 py-4 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
      <div className="movie-card w-full max-w-4xl overflow-hidden p-0 sm:max-h-[90vh]">
        <div className="relative h-48 w-full sm:h-80">
          {winnerMovie.backdrop_path || winnerMovie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w780${winnerMovie.backdrop_path || winnerMovie.poster_path}`}
              alt={winnerMovie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-black/55" />
          <div className="hidden absolute inset-0 sm:flex sm:flex-col sm:justify-end sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200">
              Match Found
            </p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl">
              {winnerMovie.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              {winnerMovie.overview || "Гравці обрали цей фільм одноголосно."}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90 sm:text-sm">
              <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
                ⭐ {winnerMovie.vote_average.toFixed(1)}
              </span>
              <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
                {winnerMovie.release_date?.slice(0, 4) || "Рік невідомий"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400 sm:w-fit"
            >
              Зрозуміло
            </button>
          </div>
        </div>

        <div className="space-y-3 bg-slate-950 px-4 py-5 sm:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-200">
            Match Found
          </p>
          <h2 className="text-2xl font-black text-white">
            {winnerMovie.title}
          </h2>
          <p className="text-sm leading-6 text-slate-200">
            {winnerMovie.overview || "Гравці обрали цей фільм одноголосно."}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90">
            <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
              ⭐ {winnerMovie.vote_average.toFixed(1)}
            </span>
            <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">
              {winnerMovie.release_date?.slice(0, 4) || "Рік невідомий"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default WinnerMovie;
