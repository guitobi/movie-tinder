import { createSlice } from "@reduxjs/toolkit";

import type { Room } from "../../types/types";

const initialState: Room = {
  id: "",
  players: {},
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
});

export default roomSlice.reducer;
