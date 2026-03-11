import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {},
});

export default playerSlice.reducer;
