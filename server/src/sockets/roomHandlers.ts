import { Server } from "socket.io";
import {
  JoinRoomPayload,
  LeaveRoomPayload,
  ToggleReadyPayload,
} from "../types/socket.types";
import { rooms } from "../store/roomStore";
import { Player } from "../types/room.types";

const removePlayerFromRoom = (socketId: string, roomId: string, io: Server) => {
  const room = rooms.get(roomId);

  if (!room || !room.players[socketId]) {
    return;
  }

  delete room.players[socketId];

  const players = Object.values(room.players);

  if (players.length === 0) {
    rooms.delete(roomId);
    return;
  }

  const hasHost = players.some((player) => player.isHost);

  if (!hasHost) {
    const nextHost = players[0];

    if (nextHost) {
      nextHost.isHost = true;
    }
  }

  io.to(roomId).emit("room-updated", room);
};

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

    socket.on("leave-room", ({ roomId }: LeaveRoomPayload) => {
      removePlayerFromRoom(socket.id, roomId, io);
      socket.leave(roomId);
    });

    socket.on("toggle-ready", ({ roomId, isReady }: ToggleReadyPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        return;
      }

      const player = room.players[socket.id];

      if (!player) {
        return;
      }

      player.isReady = isReady;
      io.to(roomId).emit("room-updated", room);
    });

    socket.on("disconnecting", () => {
      for (const roomId of socket.rooms) {
        if (roomId === socket.id) {
          continue;
        }

        removePlayerFromRoom(socket.id, roomId, io);
      }
    });
  });
};
