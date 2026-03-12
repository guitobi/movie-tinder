import { useState, useCallback } from "react";
import type { CreateRoomResponse } from "../types/types";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useRoomId = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  const createRoom = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${URL}/api/rooms/create`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Error with creating room! Try again later");
      }

      const data: CreateRoomResponse = await res.json();
      const roomIdApi = data.roomId;

      // dispatch(setRoomId(roomIdApi));
      // navigate(`/rooms/${roomIdApi}`);
      return roomIdApi;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating room:", err.message);
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, createRoom };
};

export default useRoomId;
