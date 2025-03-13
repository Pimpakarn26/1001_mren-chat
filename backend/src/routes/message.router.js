import express from 'express';
const router = express.Router();
import { getUserForSidebar } from '../controllers/message.controller';
import { protectedRoute } from './../middleware/auth.middleware';

// Route to get messages
router.get('/users', protectedRoute, getUserForSidebar);

export default router;