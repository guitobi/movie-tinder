import type { Movie } from "../types/types";

interface SessionStorageFunc {
  (username: string, roomId: string): void;
}

const PLAYER_TOKEN_KEY = "playerToken";
const USERNAME_KEY = "username";
const ROOMID_KEY = "roomId";

export interface SessionStorageOutput {
  username: string | null;
  roomId: string | null;
}

export const setSessionStorage: SessionStorageFunc = (username, roomId) => {
  sessionStorage.setItem(USERNAME_KEY, username);
  sessionStorage.setItem(ROOMID_KEY, roomId);
  getOrCreatePlayerToken();
};

export const getOrCreatePlayerToken = () => {
  const existingToken = sessionStorage.getItem(PLAYER_TOKEN_KEY);

  if (existingToken) {
    return existingToken;
  }

  const nextToken =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  sessionStorage.setItem(PLAYER_TOKEN_KEY, nextToken);
  return nextToken;
};

export const clearSessionStorage = () => {
  sessionStorage.removeItem(USERNAME_KEY);
  sessionStorage.removeItem(ROOMID_KEY);
  sessionStorage.removeItem(PLAYER_TOKEN_KEY);
};

export const getSessionStorage = () => {
  const username = sessionStorage.getItem(USERNAME_KEY);
  const roomId = sessionStorage.getItem(ROOMID_KEY);

  if (username && roomId) return { username, roomId };
  return null;
};

export const mapMovieToPanelData = (movie: Movie | undefined) => {
  if (!movie) {
    return {
      genre: "No data",
      rating: "-",
      eyebrow: "Featured movie",
      title: "Очікуємо фільми з сервера",
      meta: "Натисніть 'Почати гру' у кімнаті",
      imageUrl: null,
      description:
        "Після запуску гри бекенд пришле об'єкт кімнати з масивом movies.",
      tags: ["Waiting for room data"],
      stats: [
        { label: "Рейтинг", value: "-" },
        { label: "Мова", value: "-" },
        { label: "Голосів", value: "-" },
      ],
    };
  }

  const year = movie.release_date?.slice(0, 4) || "-";
  const language = movie.original_language?.toUpperCase() || "-";
  const imagePath = movie.backdrop_path || movie.poster_path || "";
  const imageUrl = imagePath
    ? `https://image.tmdb.org/t/p/w780${imagePath}`
    : null;

  const tags = [
    movie.adult ? "18+" : "Family-friendly",
    movie.video ? "Has trailer" : "Movie",
    `Popularity ${Math.round(movie.popularity)}`,
  ];

  return {
    genre:
      movie.genre_ids.length > 0
        ? `Genres: ${movie.genre_ids.join(", ")}`
        : "Unknown genre",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "-",
    eyebrow: "Featured movie",
    title: movie.title || movie.original_title || "Untitled",
    meta: `${year} • ${language} • votes ${movie.vote_count}`,
    imageUrl,
    description: movie.overview || "Опис відсутній",
    tags,
    stats: [
      {
        label: "Рейтинг",
        value: movie.vote_average ? movie.vote_average.toFixed(1) : "-",
      },
      { label: "Мова", value: language },
      { label: "Голосів", value: String(movie.vote_count) },
    ],
  };
};
