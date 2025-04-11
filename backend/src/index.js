import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.router.js";
import { app, server } from "./lib/socket.js";
import messageRouter from "./routes/message.router.js";
import friendRouter from "./routes/friend.router.js";

dotenv.config();

const PORT = process.env.PORT;

// Routes
app.get("/", (req, res) => {
  res.send("<h1>RESTFUL SERVICE FOR MREN CHAT PROJECT</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/friend", friendRouter);

// Start server
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
