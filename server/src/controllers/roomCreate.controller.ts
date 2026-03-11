import { io } from "..";
import { rooms } from "../store/roomStore";
import { Room } from "../types/room.types";
import { generateUniqueRoomId } from "../utils/utils";

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
