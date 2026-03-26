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
  likedMovies: Record<number, string[]>;
}

export type selectedMode =
  | "top-imdb"
  | "legendary-horror"
  | "new-releases"
  | "action-packed"
  | "comedy-central"
  | "romantic-evening"
  | "sci-fi-fantasy"
  | "90s-classics";

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
  runtime?: number;
  director?: string;
  cast?: string[];
  trailer?: string;
  genres?: { id: number; name: string }[];
  streamingInfo?: {
    platforms: {
      flatrate?: Array<{
        logo_path: string;
        provider_name: string;
        display_priority: number;
      }>;
      buy?: Array<{
        logo_path: string;
        provider_name: string;
        display_priority: number;
      }>;
    };
  };
}
