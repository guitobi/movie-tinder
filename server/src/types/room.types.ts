export interface Player {
  id: string;
  playerToken?: string;
  username: string;
  likes: [];
  isReady: boolean;
  isHost: boolean;
}

export interface Room {
  id: string;
  players: Record<string, Player>;
  movies: Movie[];
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: [];
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
