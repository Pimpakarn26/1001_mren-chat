import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:[process.env.FRONTEND_URL],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);
    const { userId } = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A User Disconnected", socket.id);
        delete userSocketMap[userId];
    });
});

export {io, app, server};