import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { setupWebSocket } from "./socket";
import { connectRabbitMQ } from "./rabbitmq";

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
setupWebSocket(io);
connectRabbitMQ(io);