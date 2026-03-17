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
