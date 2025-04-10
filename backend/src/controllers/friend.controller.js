import User from "../models/user.model.js";
import mongoose from 'mongoose'; // เพิ่มการ import mongoose

export const addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        if (!friendId) {
            return res.status(400).json({ message: "friendId is required" });
        }
        
        const userId = req.user._id;
        console.log("friend:", friendId, "user:", userId);

        // แปลงเป็น ObjectId ถ้า friendId หรือ userId เป็นสตริง
        if (!mongoose.Types.ObjectId.isValid(friendId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user or friend ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        if (userId.toString() === friendId) {
            return res.status(400).json({ message: "You cannot add yourself as a friend" });
        }

        // เช็คว่ามีฟิลด์ friends ก่อนใช้งาน
        if (!user.friends) user.friends = [];
        if (!friend.friends) friend.friends = [];
        if (!user.friendRequest) user.friendRequest = [];
        if (!friend.friendRequest) friend.friendRequest = [];

        if (user.friends.some(id => id.toString() === friendId)) {
            return res.status(400).json({ message: "Already friends" });
        }

        if (user.friendRequest.some(id => id.toString() === friendId)) {
            user.friends.push(friendId);
            friend.friends.push(userId);
            user.friendRequest = user.friendRequest.filter(
                (id) => id.toString() !== friendId
            );
            friend.friendRequest = friend.friendRequest.filter(
                (id) => id.toString() !== userId
            );
            await user.save();
            await friend.save();
            return res.status(200).json({ message: "Friend request accepted" });
        }

        if (!friend.friendRequest.some(id => id.toString() === userId.toString())) {
            friend.friendRequest.push(userId);
            await friend.save();
        }

        res.status(200).json({ message: "Friend request sent" });
    } catch (error) {
        console.error("Error adding friend:", error);
        res.status(500).json({
            message: "Internal server error while adding a new friend",
            error: error.message
        });
    }
};

export const acceptFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        if (!friendId) {
            return res.status(400).json({ message: "friendId is required" });
        }
        
        const userId = req.user._id;
        console.log("friend:", friendId, "user:", userId);

        // แปลงเป็น ObjectId ถ้า friendId หรือ userId เป็นสตริง
        if (!mongoose.Types.ObjectId.isValid(friendId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user or friend ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: "Friend not found" });
        }

        if (userId.toString() === friendId) {
            return res.status(400).json({ message: "You cannot accept yourself as a friend" });
        }

        // เช็คว่ามีฟิลด์ friends ก่อนใช้งาน
        if (!user.friends) user.friends = [];
        if (!friend.friends) friend.friends = [];
        if (!user.friendRequest) user.friendRequest = [];
        if (!friend.friendRequest) friend.friendRequest = [];

        if (!user.friendRequest.some(id => id.toString() === friendId)) {
            return res.status(404).json({ message: "No Friend request from this user" });
        }

        // ยอมรับคำขอเป็นเพื่อน
        user.friends.push(friendId);
        friend.friends.push(userId);

        // ลบ friendRequest ที่เกี่ยวข้องออก
        user.friendRequest = user.friendRequest.filter(
            (id) => id.toString() !== friendId
        );
        friend.friendRequest = friend.friendRequest.filter(
            (id) => id.toString() !== userId.toString()
        );

        await user.save();
        await friend.save();
        return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({
            message: "Internal server error while accepting friend request",
            error: error.message
        });
    }
};
