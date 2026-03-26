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
  {
    key: "action-packed",
    title: "Бойовики",
    description:
      "Екшн фільми з високою енергетикою та приголомшливими сценами.",
    details: "Фокус на жанрі Action з високим рівнем епічності",
    movieFeedHint: "У пріоритеті фільми жанру бойовик",
    presetCode: "ROOM_MODE_ACTION_PACKED",
  },
  {
    key: "comedy-central",
    title: "Комедії",
    description: "Смішні фільми для легкого та веселого вечора.",
    details: "Фокус на жанрі Comedy для гарного настрою",
    movieFeedHint: "У пріоритеті фільми жанру комедія",
    presetCode: "ROOM_MODE_COMEDY_CENTRAL",
  },
  {
    key: "romantic-evening",
    title: "Романтичний вечір",
    description: "Романтичні фільми для особливих моментів.",
    details: "Фокус на жанрі Romance для затишку",
    movieFeedHint: "У пріоритеті фільми жанру романтика",
    presetCode: "ROOM_MODE_ROMANTIC_EVENING",
  },
  {
    key: "sci-fi-fantasy",
    title: "Фантастика",
    description: "Наукова фантастика та фентезі для подорожей у майбутнє.",
    details: "Фокус на жанрах Science Fiction та Fantasy",
    movieFeedHint: "У пріоритеті фільми жанрів фантастика та фентезі",
    presetCode: "ROOM_MODE_SCI_FI_FANTASY",
  },
  {
    key: "90s-classics",
    title: "Класика 90-х",
    description: "Культові фільми з золотої епохи 90-х років.",
    details: "Фокус на фільмах випущених у 1990-1999 роках",
    movieFeedHint: "У пріоритеті фільми 90-х років",
    presetCode: "ROOM_MODE_90S_CLASSICS",
  },
];

export const getGameModeByKey = (modeKey: GameModeKey | null) => {
  if (!modeKey) {
    return null;
  }

  return GAME_MODES.find((mode) => mode.key === modeKey) ?? null;
};
