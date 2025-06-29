import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);
let io;
const userSocketMap = {};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.userId = userData._id;
      console.log("User setup complete:", userData._id);
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room:", room);
    });

    socket.on("typing", (room) => {
      socket.in(room).emit("typing", { senderId: socket.userId });
    });

    socket.on("stop typing", (room) => {
      socket.in(room).emit("stop typing", { senderId: socket.userId });
    });

    socket.on("new message", (newMessageReceived) => {
      let chat = newMessageReceived.conversation;
      if (!chat.participants) return console.log("chat.participants not defined");

      chat.participants.forEach((user) => {
        if (user._id === newMessageReceived.senderId._id) return;
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });

    socket.on("message status update", (data) => {
      const { messageId, status, receiverId } = data;
      socket.in(receiverId).emit("message status updated", { messageId, status });
    });

    socket.on("message reaction", (data) => {
      const { messageId, reactionType, conversationId } = data;
      socket.in(conversationId).emit("message reaction updated", {
        messageId,
        reactionType,
        userId: socket.userId,
      });
    });

    socket.on("message edit", (data) => {
      const { messageId, newMessage, conversationId } = data;
      socket.in(conversationId).emit("message edited", {
        messageId,
        newMessage,
        userId: socket.userId,
      });
    });

    socket.on("message delete", (data) => {
      const { messageId, conversationId } = data;
      socket.in(conversationId).emit("message deleted", {
        messageId,
        userId: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getReceiverSocketId = (receiverId) => {
  const receiverSocket = Array.from(io.sockets.sockets.values()).find(
    (socket) => socket.userId === receiverId
  );
  return receiverSocket ? receiverSocket.id : null;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { app, io, server };
