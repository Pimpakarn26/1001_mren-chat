import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
dotenv.config();
import authRouter from "./routes/auth.router.js";
import messageRouter from "./models/message.model.js";

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;

//create app
app.use(cookieParser());

//connect data base
// try {
//     mongoose.connect(DB_URL);
//     console.log("connect to mongo db successfully");
// } catch (error) {
//     console.log("connect failed " + error);
// }

//allow web can connect app
//origin=BASE_URL: allow web can connect to app
app.use(cors({ 
    origin: FRONTEND_URL, 
    credentials: true 
}));
app.use(express.json({
  limit: "50mb",
}));


app.get("/", (req, res) => {
  res.send("<h1>RESTFUL  SERVICE FOR MREN CHAT PROJECT</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", messageRouter);


server.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();
});
