export interface JoinRoomPayload {
  roomId: string;
  username: string;
  playerToken?: string;
}

export interface LeaveRoomPayload {
  roomId: string;
}

export interface ToggleReadyPayload {
  roomId: string;
  isReady: boolean;
}

export interface StartGamePayload {
  roomId: string;
  selectedMode: string;
  numberOfMovies: number;
}

export interface ResetRoundPayload {
  roomId: string;
}

export interface SwipeMoviePaload {
  roomId: string;
  playerId: string;
  movieId: number;
}

export interface LeaveGamePayload {
  roomId: string;
}
