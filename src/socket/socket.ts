import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "https://socia-buzzz.netlify.app",
    credentials: true,
    methods: ["PUT", "GET", "POST", "DELETE"],
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://socia-buzzz.netlify.app",
    methods: ["PUT", "GET", "POST", "DELETE"],
    credentials: true,
  },
});

export const getRecipientSocketId = (recipientId: string) => {
  return userSocketMap[recipientId];
};
const userSocketMap: Record<string, string> = {};
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const userId = socket.handshake.query.userId as string;
  // console.log(userId);
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // console.log(socket.id, "hll", userId);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessageAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );
      io.to(userSocketMap[userId]).emit("messageSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user Disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
