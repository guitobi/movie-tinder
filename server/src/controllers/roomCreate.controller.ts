import { rooms } from "../store/roomStore";
import { Room } from "../types/room.types";
import { generateUniqueRoomId } from "../utils/utils";
import { Response, Request } from "express";

export const roomCreate = async (_req: Request, res: Response) => {
  //generate id
  const roomId = generateUniqueRoomId();

  //create empty room
  const room: Room = {
    id: roomId,
    players: {},
    movies: [],
    likedMovies: {},
  };
  //add room to store
  rooms.set(roomId, room);

  //send id to client
  res.status(200).json({
    roomId,
  });
};
