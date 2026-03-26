import type { GameModeKey, GameModeOption } from "../../types/types";

interface ModePickerContentProps {
  gameModes: GameModeOption[];
  selectedMode: GameModeKey | null;
  selectedMoviesCount: number;
  onSelectMode: (mode: GameModeKey) => void;
  onSelectMoviesCount: (count: number) => void;
  onClose?: () => void;
  isHost: boolean;
}

const MOVIES_COUNT_OPTIONS = [5, 10, 15, 20];

const ModePickerContent = ({
  gameModes,
  selectedMode,
  selectedMoviesCount,
  onSelectMode,
  onSelectMoviesCount,
  onClose,
  isHost,
}: ModePickerContentProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Режим гри</h3>
      {!isHost && (
        <p className="text-sm text-amber-400 mb-2">
          Тільки хост може змінювати налаштування гри
        </p>
      )}
      <p className="text-sm text-slate-400 mb-4">
        Оберіть формат перед стартом матчу
      </p>

      <div className="space-y-2">
        {gameModes.map((mode) => {
          const isSelected = selectedMode === mode.key;

          return (
            <button
              key={mode.key}
              onClick={() => {
                if (isHost) {
                  onSelectMode(mode.key);
                  // Close modal only if a movie count is already selected
                  if (selectedMoviesCount > 0) {
                    onClose?.();
                  }
                }
              }}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-all duration-200 ${
                isSelected
                  ? "bg-purple-600/20 border-purple-400"
                  : isHost
                    ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-400/60 hover:bg-slate-800/70"
                    : "bg-slate-900/30 border-purple-500/10 cursor-not-allowed opacity-50"
              }`}
              title={isHost ? mode.title : "Тільки для хоста"}
              disabled={!isHost}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-semibold text-base">
                  {mode.title}
                </p>
                {isSelected && (
                  <span className="text-xs text-green-300 bg-green-500/20 border border-green-500/30 px-2 py-0.5 rounded-full">
                    Обрано
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm mt-1">{mode.description}</p>
              <p className="text-slate-500 text-xs mt-1">{mode.details}</p>
              <p className="text-purple-300/80 text-xs mt-1.5">
                Підбір: {mode.movieFeedHint}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-purple-500/20 pt-4">
        <h4 className="text-sm font-semibold text-white">Кількість фільмів</h4>
        {!isHost && (
          <p className="mt-1 text-xs text-amber-400">
            Тільки хост може змінювати кількість фільмів
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          Оберіть, скільки фільмів буде в раунді
        </p>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {MOVIES_COUNT_OPTIONS.map((count) => {
            const isSelected = selectedMoviesCount === count;

            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  if (isHost) {
                    onSelectMoviesCount(count);
                    // Close modal only if a mode is already selected
                    if (selectedMode) {
                      onClose?.();
                    }
                  }
                }}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? "bg-purple-600/20 border-purple-400 text-white"
                    : isHost
                      ? "bg-slate-900/50 border-purple-500/20 text-slate-300 hover:border-purple-400/60 hover:bg-slate-800/70"
                      : "bg-slate-900/30 border-purple-500/10 text-slate-500 cursor-not-allowed opacity-50"
                }`}
                disabled={!isHost}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModePickerContent;
