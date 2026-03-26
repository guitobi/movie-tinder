import type { GameModeKey, GameModeOption } from "../../types/types";

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
  {
    key: "new-releases",
    title: "Новинки",
    description: "Останні релізи та нові фільми для справжніх кіноманів.",
    details: "Фокус на фільмах останніх 3 років",
    movieFeedHint: "У пріоритеті нові випуски фільмів",
    presetCode: "ROOM_MODE_NEW_RELEASES",
  },
];

export const getGameModeByKey = (modeKey: GameModeKey | null) => {
  if (!modeKey) {
    return null;
  }

  return GAME_MODES.find((mode) => mode.key === modeKey) ?? null;
};
