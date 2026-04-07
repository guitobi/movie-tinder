import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import router from "./routes/room.routes";
import { setupRoomHandlers } from "./sockets/roomHandlers";

// Validate required environment variables
if (!process.env.TMDB_API_KEY) {
  console.error("ERROR: TMDB_API_KEY is not set in environment variables");
  process.exit(1);
}

export const app = express();

const PORT = process.env.PORT || 8000;
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
}));
app.use(express.json());
app.use("/api/rooms/", router);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: CORS_ORIGINS,
    credentials: true,
  },
});

// connect socket
setupRoomHandlers(io);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGINS.join(", ")}`);
});
