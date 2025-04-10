import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  sendMessage,
  getMessage,
} from "../controllers/message.controller.js";
import { checkFriendShip } from "../middleware/friend.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, checkFriendShip, sendMessage);

export default router;