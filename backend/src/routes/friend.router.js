import express from "express";
import { addFriend, acceptFriend } from "../controllers/friend.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router(); //ประกาศ router

router.post("/add", protectedRoute, addFriend);
router.post("/accept", protectedRoute, acceptFriend);

export default router; //ใช้ export default เพื่อป้องกันการ import ซ้ำซ้อน
