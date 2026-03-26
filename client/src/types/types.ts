import type { store } from "../store/store";

export type GameModeKey = "top-imdb" | "legendary-horror" | "new-releases";

export interface CreateRoomResponse {
  roomId: string;
}

export interface GameModeOption {
  key: GameModeKey;
  title: string;
  description: string;
  details: string;
  movieFeedHint: string;
  presetCode: string;
}
export interface Player {
  id: string;
  username: string;
  likes: [];
  isReady: boolean;
  isHost: boolean;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
  movies: Movie[];
}

export interface Game {
  currentIndex: number;
  //   matchedMovies: null; movie object as a type
  isLoading: boolean;
  winnerMovie: Movie;
}

export type RootState = ReturnType<typeof store.getState>;
