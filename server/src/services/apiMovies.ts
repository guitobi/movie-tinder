export const fetchMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
  );
  const data = await res.json();
  return data;
};

// Function to fetch additional movie details (runtime, cast, director, etc.)
export const fetchMovieDetails = async (movieId: number) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,videos`,
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch movie details: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
