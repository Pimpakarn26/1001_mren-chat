import { Server } from "socket.io";
import http from "http";
import express from "express";
// import cors from "cors"
// import "dotenv/config";

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
const userSocketMap = {}; // {userId: socketId} สร้างคู่ id เพื่อเชื่อมต่อให้ถูกคู่

io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);
    const { userId } = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("friendRequestSent", (friendId)=>{
        const reciverSocketId = getReceiverSocketId(friendId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("friendRequstReceived", userId);
        }
    })

    //ลบคนที่ Disconnect ออก ส่งว่าdisconnect
    socket.on("disconnect", () => {
        console.log("A User Disconnected", socket.id);
        delete userSocketMap[userId];
        console.log("UserSockerMap", userSocketMap);
    });
});

export {io, app, server};