import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { Movie, Room } from "../types/types";
import { updateRoom } from "../store/slices/roomSlice";
import { resetGameState, setWinnerMovie } from "../store/slices/gameSlice";
import { getOrCreatePlayerToken } from "../utils/utils";
import socket from "../services/socket";

export const useGameSockets = (
  roomId: string | undefined,
  username: string,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!roomId || !username) {
      return;
    }

    const handleRoomData = (incomingRoom: Room) => {
      dispatch(updateRoom(incomingRoom));
    };

    const handleStartingGame = (incomingRoom: Room) => {
      dispatch(resetGameState());
      dispatch(updateRoom(incomingRoom));
    };

    const handleMatchedFilm = (winnerMovie: Movie) => {
      if (winnerMovie) {
        dispatch(setWinnerMovie(winnerMovie));
      }
    };

    socket.on("room-updated", handleRoomData);
    socket.on("starting-game", handleStartingGame);
    socket.emit("create-room", {
      roomId,
      username,
      playerToken: getOrCreatePlayerToken(),
    });

    socket.on("matched-film", handleMatchedFilm);

    return () => {
      socket.off("room-updated", handleRoomData);
      socket.off("starting-game", handleStartingGame);
      socket.off("matched-film", handleMatchedFilm);
    };
  }, [dispatch, roomId, username]);
};
