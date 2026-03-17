import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Player, Room } from "../../types/types";

const initialState: Room = {
  id: "",
  players: {},
  movies: [],
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
    updateRoom(state, action: PayloadAction<Room>) {
      state.id = action.payload.id;
      state.players = action.payload.players;
      state.movies = action.payload.movies;
    },
  },
});

export const { setRoomId, setPlayers, updateRoom } = roomSlice.actions;

export default roomSlice.reducer;
