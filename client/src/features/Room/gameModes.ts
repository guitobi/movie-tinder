export type GameModeKey = "top-imdb" | "legendary-horror";

export const GAME_MODES: { [key in GameModeKey]: string } = {
  "top-imdb": "Топ IMDb",
  "legendary-horror": "Легендарні хорори",
};

export const getGameModeByKey = (modeKey: GameModeKey | null) => {
  if (!modeKey) {
    return null;
  }

  return GAME_MODES[modeKey] ?? null;
};
