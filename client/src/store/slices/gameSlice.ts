import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Game, Movie } from "../../types/types";

const initialState: Game = {
  currentIndex: 0,
  isLoading: false,
  winnerMovie: {
    adult: false,
    backdrop_path: "",
    genre_ids: [],
    id: 0,
    original_language: "",
    original_title: "",
    overview: "",
    popularity: 0,
    poster_path: "",
    release_date: "",
    title: "",
    video: false,
    vote_average: 0,
    vote_count: 0,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetGameState(state) {
      state.currentIndex = initialState.currentIndex;
      state.isLoading = initialState.isLoading;
      state.winnerMovie = initialState.winnerMovie;
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = Math.max(0, action.payload);
    },
    nextMovie(state, action: PayloadAction<{ totalMovies: number }>) {
      const lastIndex = Math.max(action.payload.totalMovies - 1, 0);
      state.currentIndex = Math.min(state.currentIndex + 1, lastIndex);
    },
    setWinnerMovie(state, action: PayloadAction<Movie>) {
      state.winnerMovie = action.payload;
    },
  },
});

export const { resetGameState, setCurrentIndex, nextMovie, setWinnerMovie } =
  gameSlice.actions;

export default gameSlice.reducer;
