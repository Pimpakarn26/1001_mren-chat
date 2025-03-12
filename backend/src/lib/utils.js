import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;

//export เเบบนี้สามารถส่งออกได้หลายตัว
export const generateToken = (userId, res) => {
    const token = jwt.sign({userId }, secret, { 
        expiresIn: "1d"
    });

    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000, //MS
        httpOnly: true, //XSS Attacks
        samesite: "strict", //CSRF attacks
        secure: node_mode !== "development",

    })
    console.log("Token generated ans cookie set", token);

    return token;
};


