import User from "../models/user.model.js";

export const checkFriendShip = async (req, res, next) => {
    const { id: friendId } = req.params;  // ใช้ Destructuring params
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user.friends.includes(friendId)) {
            return res.status(403).json({ message: "You are not friends with this user" });
        }
        next();  // ถ้าตรวจสอบผ่าน ให้ไป middleware ถัดไป
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error While checking friendship" });
    }
};
