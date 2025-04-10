import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    //ถ้าเเม่กับลูกไม่เหมือนกันต้องเขียน email:email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error While registering user" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid password!",
      });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error While signing in" });
  }
};

export const logout = async (req, res) => {
  try {
    //ลบ token ออกจาก cookie
    res.clearCookie("jwt", "", { maxAge: 0 });
    // ส่งข้อความว่า logout สำเร็จ
    return res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    return res.status(500).json({ message: "Error while logging out" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if (updateUser) {
      return res.status(200).json(updateUser);
    } else {
      return res.status(500).json({ message: "Error while Updating profile picture" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error While Update" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    console.log(req.user);

    return res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error while checking Auth" });
  }
};
