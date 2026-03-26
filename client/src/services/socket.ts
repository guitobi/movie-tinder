import { io } from "socket.io-client";
import type { GameModeKey } from "../types/types";

const socket = io(import.meta.env.VITE_SERVER_URL);

export default socket;

// Basic socket emit function for starting game
export const emitStartGame = (
  roomId: string,
  gameModeKey: GameModeKey,
  numberOfMovies: number,
) => {
  socket.emit("start-game", {
    roomId,
    selectedMode: gameModeKey,
    numberOfMovies,
  });
};
