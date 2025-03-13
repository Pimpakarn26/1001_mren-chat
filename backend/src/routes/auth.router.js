import express from 'express';
const router = express.Router(); //class
import { signup, signin, logout, updateProfile, checkAuth, } from "../controllers/auth.controller.js"; 
import { protectedRoute } from '../middleware/auth.middleware.js';

//http://localhost:5000/api/auth/signup
router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);

router.get("/check", protectedRoute, checkAuth)

export default router;