import type { store } from "../store/store";

export interface CreateRoomResponse {
  roomId: string;
}

export interface Player {
  id: string;
  username: string;
  likes: [];
  isReady: boolean;
  isHost: boolean;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
}

export interface Game {
  movies: [];
  currentIndex: number;
  playerLikes: [];
  //   matchedMovies: null; movie object as a type
  isLoading: boolean;
}

export type RootState = ReturnType<typeof store.getState>;
