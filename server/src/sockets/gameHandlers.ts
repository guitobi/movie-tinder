import { Server } from "socket.io";
import { rooms } from "../store/roomStore";
import { fetchPopularMovies } from "../utils/utils";

export const startGameHandler = async (roomId: string, io: Server) => {
  const room = rooms.get(roomId);

  if (!room) return;

  const fetchedMovies = await fetchPopularMovies();
  if (!fetchedMovies) return;
  if (fetchedMovies.length === 0) return;

  room.movies.push(...fetchedMovies);

  io.to(roomId).emit("starting-game", room);
};

export const likedMovieHandler = async (
  roomId: string,
  playerId: string,
  movieId: number,
  io: Server,
) => {
  const room = rooms.get(roomId);

  if (!room) return;

  if (!room.likedMovies[movieId]) room.likedMovies[movieId] = [];

  if (room.likedMovies[movieId].includes(playerId)) return;

  room.likedMovies[movieId]?.push(playerId);

  if (room.likedMovies[movieId].length === Object.keys(room.players).length) {
    const winnerMovie = room.movies.find((m) => m.id === movieId);

    io.to(roomId).emit("matched-film", winnerMovie);
  }
};
