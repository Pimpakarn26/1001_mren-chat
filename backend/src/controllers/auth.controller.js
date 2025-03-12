import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    try{
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "Email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            
        })
        if(newUser){
             generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({message: "Invalid user data"});
        }
    }catch(error){
        console.error("❌ Signup error:", error);
        res.status(500).json({message: "Internal server error While registering a new user"});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Email or Password is missing"});
    }
        
}

//logout
export const logout = async (req, res) => {
    try{
        res.cookie("jwt",)
    }catch(error){
        res.status(500).json({message: "Internal server error While logging out"});
    }
}