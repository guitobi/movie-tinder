import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Game } from "../../types/types";

const initialState: Game = {
  movies: [],
  currentIndex: 0,
  playerLikes: [],
  isLoading: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    resetGameState(state) {
      state.currentIndex = 0;
      state.playerLikes = [];
    },
    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = Math.max(0, action.payload);
    },
    nextMovie(state, action: PayloadAction<{ totalMovies: number }>) {
      const lastIndex = Math.max(action.payload.totalMovies - 1, 0);
      state.currentIndex = Math.min(state.currentIndex + 1, lastIndex);
    },
    addPlayerLike(state, action: PayloadAction<number>) {
      if (!state.playerLikes.includes(action.payload)) {
        state.playerLikes.push(action.payload);
      }
    },
  },
});

export const { resetGameState, setCurrentIndex, nextMovie, addPlayerLike } =
  gameSlice.actions;

export default gameSlice.reducer;
