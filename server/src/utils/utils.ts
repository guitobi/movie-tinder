import { rooms } from "../store/roomStore";
import "dotenv/config";
import { Movie, selectedMode } from "../types/room.types";

interface DetailedMovieData {
  id: number;
  title: string;
  runtime: number;
  overview: string;
  release_date: string;
  genres: Array<{ id: number; name: string }>;
  credits: {
    crew: Array<{
      job: string;
      name: string;
    }>;
    cast: Array<{
      name: string;
    }>;
  };
  videos: {
    results: Array<{
      type: string;
      site: string;
      key: string;
    }>;
  };
  external_ids: {
    imdb_id: string;
  };
}

interface StreamingData {
  results: Record<
    string,
    {
      link: string;
      flatrate?: Array<{
        logo_path: string;
        provider_id: number;
        provider_name: string;
        display_priority: number;
      }>;
      buy?: Array<{
        logo_path: string;
        provider_id: number;
        provider_name: string;
        display_priority: number;
      }>;
    }
  >;
}

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
    if (selectedMode === "action-packed") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=28&sort_by=popularity.desc&page=${randomPage}`;
    }
    if (selectedMode === "comedy-central") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=35&sort_by=popularity.desc&page=${randomPage}`;
    }
    if (selectedMode === "romantic-evening") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=10749&sort_by=popularity.desc&page=${randomPage}`;
    }
    if (selectedMode === "sci-fi-fantasy") {
      // Combined query for both sci-fi (878) and fantasy (14) genres
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&with_genres=878%2C14&sort_by=popularity.desc&page=${randomPage}`;
    }
    if (selectedMode === "90s-classics") {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&sort_by=popularity.desc&page=${randomPage}`;
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

// Function to enhance movie data with additional details
export async function enhanceMovieWithDetails(movie: Movie): Promise<Movie> {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB_API_KEY is not set");
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,external_ids`,
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch details for movie ${movie.id}:`,
        res.status,
        res.statusText,
      );
      return movie; // Return original movie if details fail to load
    }

    const detailedData = (await res.json()) as DetailedMovieData;

    // Extract director from credits
    const director =
      detailedData.credits?.crew?.find(
        (person: any) => person.job === "Director",
      )?.name || "";

    // Extract top 3 cast members
    const cast =
      detailedData.credits?.cast
        ?.slice(0, 3)
        .map((person: any) => person.name) || [];

    // Find trailer from videos
    const trailer =
      detailedData.videos?.results?.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube",
      )?.key || "";

    // Extract IMDB ID for streaming information lookup
    const imdbId = detailedData.external_ids?.imdb_id;

    // Initialize streaming info as undefined
    let streamingInfo = undefined;

    // Fetch streaming information if we have an IMDB ID
    if (imdbId && process.env.TMDB_API_KEY) {
      try {
        const region = "US"; // Could be made configurable later
        const streamingRes = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`,
        );

        if (streamingRes.ok) {
          const streamingData = (await streamingRes.json()) as StreamingData;

          if (streamingData.results && streamingData.results[region]) {
            streamingInfo = {
              platforms: streamingData.results[region],
            };
          }
        }
      } catch (streamingError) {
        console.error(
          `Failed to fetch streaming info for movie ${movie.id}:`,
          streamingError,
        );
        // Continue without streaming info
      }
    }

    // Combine with existing movie data
    return {
      ...movie,
      runtime: detailedData.runtime || movie.runtime,
      director: director || movie.director,
      cast: cast.length > 0 ? cast : movie.cast,
      trailer: trailer || movie.trailer,
      genres: detailedData.genres || movie.genres,
      streamingInfo: streamingInfo || movie.streamingInfo,
    };
  } catch (error) {
    console.error("enhanceMovieWithDetails error:", error);
    return movie; // Return original movie if enhancement fails
  }
}

// Enhanced version of fetchPopularMovies that includes additional details
export async function fetchPopularMoviesWithDetails(
  selectedMode: selectedMode,
  numberOfMovies: number,
): Promise<Movie[] | null> {
  try {
    const basicMovies = await fetchPopularMovies(selectedMode, numberOfMovies);

    if (!basicMovies) {
      return null;
    }

    // Enhance each movie with additional details
    const enhancedMovies = await Promise.all(
      basicMovies.map((movie) => enhanceMovieWithDetails(movie)),
    );

    return enhancedMovies;
  } catch (error) {
    console.error("fetchPopularMoviesWithDetails error:", error);
    return null;
  }
}
