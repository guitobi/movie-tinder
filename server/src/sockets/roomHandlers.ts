import { Server } from "socket.io";
import { JoinRoomPayload } from "../types/socket.types";
import { rooms } from "../store/roomStore";
import { Player } from "../types/room.types";

export const setupRoomHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("create-room", ({ roomId, username }: JoinRoomPayload) => {
      const room = rooms.get(roomId);

      if (!room) return;

      const player: Player = {
        id: socket.id,
        username,
        likes: [],
        isReady: false,
        isHost: Object.keys(room.players).length === 0,
      };

      room.players[socket.id] = player;
      socket.join(roomId);
      io.to(roomId).emit("room-updated", room);
    });
  });
};
