import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Player } from "../../types/types";

const initialState: Player = {
  id: "",
  username: "",
  isReady: false,
  likes: [],
  isHost: false,
};

export const playerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = playerSlice.actions;

export default playerSlice.reducer;
