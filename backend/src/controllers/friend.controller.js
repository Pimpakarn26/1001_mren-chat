import User from "../models/user.model.js";

export const addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;
        console.log("friend:", friendId, "user:", userId);

        if (userId === friendId)return res.status(400).json({ message: "You cannot add yourself as a friend" });

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!friend) return res.status(404).json({ message: "Friend not found" });
        //check if already friends
    if(user.friends.includes(friendId)){
        return res.status(400).json({ message: "Already friends" });
    }
    //check if friend requst already sent
    if(user.friendRequests.includes(friendId)){
        user.friends.push(friendId);
        friend.friends.push(userId);
        user.friendRequests = user.friendRequests.filter(
            (id) = friend !== id.toString()
        );
        friend.friendRequests = friend.friendRequests.filter(
            (id) => userId !== id.toString()
        );
        await user.save();
        await friend.save();
        return res.status(200).json({ message: "Friend request accepted"})
    }
    if(friend.friendRequests.includes(userId)){
        friend.friendRequests.push(userId);
        await friend.save();
    }
    res.status(200).json({ message: "Friend request sent"});
    } catch (error) {
        res.status(500).json({
            message: "Internal server error while adding a new friend"
        });
    }
};

export const acceptFriend = async (req, res) => {
    try{
        const { friendId } =req.body;
        const userId = req.user._id;
        console.log("friend:", friendId, "user:", userId);
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if (!friend) return res.status(404).json({ message: "Friend not found" });

        if(!user.friendRequests.includes(friendId))
            return res.status(404).json({ message: "No Friend request from this user" });

        user.friends.push(friendId);
        friend.friends.push(userId);
        friend.friendRequests = friend.friendRequests.filter(
            (id) => userId !== id.toString()
        );
        await user.save();
        await friend.save();
        return res.status(200).json({ message: "Friend request accepted"});
    }catch(error){
        res.status(500).json({
            message: "Internal server error while accepting friend request"
        });
    }
}