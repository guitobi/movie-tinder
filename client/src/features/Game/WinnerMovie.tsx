import { useState } from "react";
import Spinner, { DEFAULT_SPINNER_CLOSE_DELAY_MS } from "../../ui/Spinner";

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
  onClose: () => Promise<void> | void;
  closeDelayMs?: number;
};

const WinnerMovie = ({
  hasWinnerMovie,
  winnerMovie,
  onClose,
  closeDelayMs = DEFAULT_SPINNER_CLOSE_DELAY_MS,
}: WinnerMovieProps) => {
  const [dismissedWinnerId, setDismissedWinnerId] = useState<number | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);
  const isWinnerOverlayOpen =
    winnerMovie.id !== 0 && winnerMovie.id !== dismissedWinnerId;

  const handleClose = async () => {
    if (!winnerMovie.id || isClosing) {
      return;
    }

    setIsClosing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, closeDelayMs));
      await Promise.resolve(onClose());
      setDismissedWinnerId(winnerMovie.id);
    } finally {
      setIsClosing(false);
    }
  };

  return hasWinnerMovie && isWinnerOverlayOpen ? (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 px-3 py-4 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-6">
      {isClosing ? (
        <Spinner fullscreen className="h-12 w-12 text-white" />
      ) : null}
      <div className="movie-card w-full max-w-4xl overflow-y-auto max-h-[90vh] sm:max-h-[80vh] p-0">
        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
        >
          {winnerMovie.backdrop_path || winnerMovie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w780${winnerMovie.backdrop_path || winnerMovie.poster_path}`}
              alt={winnerMovie.title}
              className="absolute top-0 left-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute top-0 left-0 h-full w-full bg-linear-to-br from-pink-500/20 via-purple-500/20 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-black/55" />
          <div className="hidden absolute inset-0 sm:flex sm:flex-col sm:justify-between sm:p-8 h-full">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-200">
                Match Found
              </p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-5xl wrap-break-word">
                {winnerMovie.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
                {winnerMovie.overview || "Гравці обрали цей фільм одноголосно."}
              </p>
            </div>
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
              disabled={isClosing}
              className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-75 sm:w-fit"
            >
              <span className="inline-flex items-center gap-2">
                {isClosing ? "Зачекай..." : "Зрозуміло"}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-3 bg-slate-950 px-4 py-5 sm:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-pink-200">
            Match Found
          </p>
          <h2 className="text-2xl font-black text-white wrap-break-word">
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
            disabled={isClosing}
            className="w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-75"
          >
            <span className="inline-flex items-center gap-2">
              {isClosing ? "Зачекай..." : "Зрозуміло"}
            </span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default WinnerMovie;
