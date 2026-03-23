import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { GameModeKey, Player, Room } from "../../types/types";

interface RoomState {
  id: string;
  players: Record<string, Player>;
  movies: Room["movies"];
  gameModeKey: GameModeKey | null;
  numberOfMovies: number;
}

const initialState: RoomState = {
  id: "",
  players: {},
  movies: [],
  gameModeKey: null,
  numberOfMovies: 0,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomId(state, action: PayloadAction<string>) {
      state.id = action.payload;
    },
    setPlayers(state, action: PayloadAction<Player>) {
      state.players[action.payload.id] = action.payload;
    },
    setGameModeKey(state, action: PayloadAction<GameModeKey | null>) {
      state.gameModeKey = action.payload;
    },
    setNumberOfMovies(state, action: PayloadAction<number>) {
      state.numberOfMovies = action.payload;
    },
    updateRoom(state, action: PayloadAction<Room>) {
      state.id = action.payload.id;
      state.players = action.payload.players;
      state.movies = action.payload.movies;
    },
  },
});

export const {
  setRoomId,
  setPlayers,
  setGameModeKey,
  setNumberOfMovies,
  updateRoom,
} = roomSlice.actions;

export default roomSlice.reducer;
