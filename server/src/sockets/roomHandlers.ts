import { Server } from "socket.io";
import {
  JoinRoomPayload,
  LeaveRoomPayload,
  ResetRoundPayload,
  SwipeMoviePaload,
  ToggleReadyPayload,
} from "../types/socket.types";
import { rooms } from "../store/roomStore";
import { Player } from "../types/room.types";
import { likedMovieHandler, startGameHandler } from "./gameHandlers";

const ROOM_DELETE_GRACE_MS = 15000;
const pendingRoomDeletionTimeouts = new Map<
  string,
  ReturnType<typeof setTimeout>
>();

const cancelPendingRoomDeletion = (roomId: string) => {
  const timeout = pendingRoomDeletionTimeouts.get(roomId);

  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  pendingRoomDeletionTimeouts.delete(roomId);
};

const scheduleRoomDeletion = (roomId: string) => {
  cancelPendingRoomDeletion(roomId);

  const timeout = setTimeout(() => {
    const room = rooms.get(roomId);

    if (!room) {
      pendingRoomDeletionTimeouts.delete(roomId);
      return;
    }

    if (Object.keys(room.players).length === 0) {
      rooms.delete(roomId);
    }

    pendingRoomDeletionTimeouts.delete(roomId);
  }, ROOM_DELETE_GRACE_MS);

  pendingRoomDeletionTimeouts.set(roomId, timeout);
};

const removePlayerFromRoom = (socketId: string, roomId: string, io: Server) => {
  const room = rooms.get(roomId);

  if (!room || !room.players[socketId]) {
    return;
  }

  delete room.players[socketId];

  const players = Object.values(room.players);

  if (players.length === 0) {
    scheduleRoomDeletion(roomId);
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
    socket.on(
      "create-room",
      ({ roomId, username, playerToken }: JoinRoomPayload) => {
        cancelPendingRoomDeletion(roomId);

        const room = rooms.get(roomId);

        if (!room) return;

        const normalizedUsername = username.trim().toLowerCase();
        const normalizedToken = playerToken?.trim();

        const existingCurrentSocketPlayer = room.players[socket.id];

        if (existingCurrentSocketPlayer) {
          existingCurrentSocketPlayer.username = username.trim();
          existingCurrentSocketPlayer.playerToken =
            normalizedToken ?? existingCurrentSocketPlayer.playerToken;
          socket.join(roomId);
          io.to(roomId).emit("room-updated", room);
          return;
        }

        const existingPlayerEntry = Object.entries(room.players).find(
          ([, player]) => {
            if (normalizedToken && player.playerToken) {
              return player.playerToken === normalizedToken;
            }

            return player.username.trim().toLowerCase() === normalizedUsername;
          },
        );

        let preservedPlayerState: Player | undefined;

        if (existingPlayerEntry) {
          const [existingSocketId, existingPlayer] = existingPlayerEntry;
          preservedPlayerState = existingPlayer;
          delete room.players[existingSocketId];

          const existingSocket = io.sockets.sockets.get(existingSocketId);
          existingSocket?.leave(roomId);
        }

        const hasHost = Object.values(room.players).some(
          (player) => player.isHost,
        );

        const player: Player = {
          id: socket.id,
          playerToken: normalizedToken ?? preservedPlayerState?.playerToken,
          username: username.trim(),
          likes: preservedPlayerState?.likes ?? [],
          isReady: preservedPlayerState?.isReady ?? false,
          isHost: preservedPlayerState?.isHost ?? !hasHost,
        };

        room.players[socket.id] = player;
        socket.join(roomId);
        io.to(roomId).emit("room-updated", room);
      },
    );

    socket.on("start-game", (roomId: string) => {
      startGameHandler(roomId, io);
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

    socket.on("like", ({ roomId, movieId, playerId }: SwipeMoviePaload) => {
      likedMovieHandler(roomId, playerId, movieId, io);
    });

    socket.on("reset-round", ({ roomId }: ResetRoundPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        return;
      }

      room.movies = [];
      room.likedMovies = {};

      for (const player of Object.values(room.players)) {
        player.isReady = false;
        player.likes = [];
      }

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
