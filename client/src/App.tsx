import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Game from "./pages/Game";
import { useEffect } from "react";
import { getSessionStorage } from "./utils/utils";
import { useDispatch } from "react-redux";
import { setRoomId } from "./store/slices/roomSlice";
import { setUsername } from "./store/slices/playerSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const data = getSessionStorage();
    if (data === null) return;
    dispatch(setUsername(data.username));
    dispatch(setRoomId(data.roomId));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="rooms/:roomId" element={<Room />} />
        <Route path="rooms/:roomId/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
