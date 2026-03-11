import { configureStore } from "@reduxjs/toolkit";

import roomReducer from "./slices/roomSlice";
import playerReducer from "./slices/playerSlice";
import gameReducer from "./slices/gameSlice";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    player: playerReducer,
    game: gameReducer,
  },
});
