import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import router from "./routes/room.routes";
import { setupRoomHandlers } from "./sockets/roomHandlers";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/rooms/", router);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

setupRoomHandlers(io);

server.listen(8000, () => {
  console.log("Server is listening");
});
