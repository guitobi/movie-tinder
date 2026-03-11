import { rooms } from "../store/roomStore";

//generates id and checks if its unique
export function generateUniqueRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let roomId = "";
  let isUnique = false;

  while (!isUnique) {
    roomId = "";
    for (let i = 0; i < 5; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (!rooms.has(roomId)) {
      isUnique = true;
    }
  }

  return roomId;
}
