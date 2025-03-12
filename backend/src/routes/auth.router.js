import express from 'express';
const router = express.Router(); //class
import { signup, signin, logout, updateProfile, } from "../controllers/auth.controller.js"; 

//http://localhost:5000/api/auth/signup
router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", logout);

router.put("/update-profile/:id", updateProfile);


export default router;