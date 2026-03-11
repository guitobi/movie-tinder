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
  movies: [];
}
