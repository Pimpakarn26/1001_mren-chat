import User from "../models/user.model";

export const checkFriendShip = async (req, res, next){
    const {id:friendId} = req.params;
    const userId = req.user._id;
    try{
        const user = await User.findById(userId);
        if(!user.friendRequest.includes(friendId)){
            return res.status(403).json({message: "You are not friend  with this user"})
        }
        next();
    }catch(error){
        res.status(500).json({message: "Internal Server Error While checking friendship"});
    }
}