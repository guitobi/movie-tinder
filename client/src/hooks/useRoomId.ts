import { useState, useCallback } from "react";
import type { CreateRoomResponse } from "../types/types";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useRoomId = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

      return roomIdApi;
    } catch (err) {
      if (err instanceof Error) {
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
