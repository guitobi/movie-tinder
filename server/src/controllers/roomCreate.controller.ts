import { io } from "..";
import { rooms } from "../store/roomStore";
import { Room } from "../types/room.types";

//generates id and checks if its unique
function generateUniqueRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let roomId = "";
  let isUnique = false;

  while (!isUnique) {
    roomId = "";
    for (let i = 0; i < 5; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const roomExists = io.sockets.adapter.rooms.has(roomId);
    if (!roomExists) {
      isUnique = true;
    }
  }
  return roomId;
}

const fetchMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
  );
  const data = await res.json();
  return data;
};

export const roomCreate = async (req, res) => {
  //generate id
  const roomId = generateUniqueRoomId();
  //create empty room
  const room: Room = {
    id: roomId,
    players: {},
    movies: [],
  };
  //add room to store
  rooms.set(roomId, room);
  //send id to client
  res.status(200).json({
    roomId,
  });
};
