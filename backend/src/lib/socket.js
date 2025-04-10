import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors"
import "dotenv/config";


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors:{
        origin:[process.env.FRONTEND_URL],
    },
});


const userSocketMap = {}; //{userId:socketId} สร้างคู่ id เพื่อเชื่อมต่อให้ถูกคู่
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//คอยฟังว่าส่งอะไรมา ส่งว่าconnect
io.on("connection", (socket) => {
  console.log("A User connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("UserSocketMap", userSocketMap);
    
  }
  //แจ้ง/ส่งสัญญาณให้ผู้ใช้
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friendRequestSent", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", userId);
    }
  })

  socket.on("friendRequestAccepted", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("friendRequestAccepted", userId);
    }
});


  //ลบคนที่ Disconnect ออก ส่งว่าdisconnect
  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

export { io, app, server };


