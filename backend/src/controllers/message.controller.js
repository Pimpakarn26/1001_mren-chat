import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import coloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from './../lib/socket.js';

export const getUserForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {$ne: loggedInUserId},
        }).select("-password")
        res.status(200).json(filteredUsers);
    }catch(error){
        res.status(500)
        .json({message: "Internal Serer Error while getting users info"});
    }
}
