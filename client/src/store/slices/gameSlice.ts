import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {},
});

export default gameSlice.reducer;
