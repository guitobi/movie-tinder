import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Room from "./pages/Room";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="rooms/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
