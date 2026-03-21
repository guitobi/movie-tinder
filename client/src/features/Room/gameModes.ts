export type GameModeKey = "top-imdb" | "legendary-horror";

export interface GameModeOption {
  key: GameModeKey;
  title: string;
  description: string;
  details: string;
  movieFeedHint: string;
  presetCode: string;
}

export const GAME_MODES: GameModeOption[] = [
  {
    key: "top-imdb",
    title: "Топ IMDb",
    description: "Добірка фільмів із найвищим рейтингом.",
    details: "Сортування за оцінкою та кількістю голосів",
    movieFeedHint: "В пріоритеті титули з високим user score",
    presetCode: "ROOM_MODE_TOP_IMDB",
  },
  {
    key: "legendary-horror",
    title: "Легендарні хорори",
    description: "Класичні та культові жахи для тематичного вечора.",
    details: "Фокус на жанрі Horror, із fallback на загальний список",
    movieFeedHint: "У пріоритеті фільми жанру жахів",
    presetCode: "ROOM_MODE_LEGENDARY_HORROR",
  },
];

export const getGameModeByKey = (modeKey: GameModeKey | null) => {
  if (!modeKey) {
    return null;
  }

  return GAME_MODES.find((mode) => mode.key === modeKey) ?? null;
};
