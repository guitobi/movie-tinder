import { rooms } from "../store/roomStore";
import "dotenv/config";
import { Movie } from "../types/room.types";

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

export async function fetchPopularMovies(): Promise<Movie[] | null> {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not set");
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
      {
        method: "GET",
      },
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch movies: ${res.status} ${res.statusText}`,
      );
    }

    const movies = (await res.json()) as unknown;

    if (
      !movies ||
      typeof movies !== "object" ||
      !Array.isArray((movies as { results?: unknown }).results)
    ) {
      return null;
    }

    const result: Movie[] = (movies as { results: Movie[] }).results;

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("fetchPopularMovies error:", error.message);
    }

    return null;
  }
}
