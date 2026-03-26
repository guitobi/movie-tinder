import { rooms } from "../store/roomStore";
import "dotenv/config";
import { Movie, selectedMode } from "../types/room.types";

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

// Shuffle array (Fisher-Yates)
function shuffleArray(array: Movie[]): Movie[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export async function fetchPopularMovies(
  selectedMode: selectedMode,
  numberOfMovies: number,
): Promise<Movie[] | null> {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not set");
    }

    // Get random page (1-10) for variety
    const randomPage = Math.floor(Math.random() * 10) + 1;

    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${randomPage}`;

    // Adjust URL based on selected game mode
    if (selectedMode === "legendary-horror") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=27&sort_by=popularity.desc&page=${randomPage}`;
    }
    if (selectedMode === "new-releases") {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear - 3}-01-01`;
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&primary_release_date.gte=${startDate}&vote_count.gte=5&vote_average.gte=3.0&with_poster=true&with_backdrop=true&sort_by=popularity.desc&page=${randomPage}`;
    }

    const res = await fetch(url, {
      method: "GET",
    });

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

    let result: Movie[] = (movies as { results: Movie[] }).results;

    // Shuffle results for randomness
    result = shuffleArray(result);

    // Return only the requested number of movies
    return result.slice(0, numberOfMovies);
  } catch (error) {
    if (error instanceof Error) {
      console.error("fetchPopularMovies error:", error.message);
    }

    return null;
  }
}
