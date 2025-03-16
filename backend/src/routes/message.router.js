import express from 'express';
const router = express.Router();
import { getUsersForSidebar, sendMessage, getMessage } from '../controllers/message.controller';
import { protectedRoute } from './../middleware/auth.middleware';

// Route to get messages
router.get('/users', protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, sendMessage);

export default router;