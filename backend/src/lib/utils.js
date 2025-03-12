import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;const node_mode = process.env.NODE_ENV;


export const generateToken = (userId, res) => {
    const token = jwt.sign({userId }, secret, { 
        expiresIn: "1d"
    });
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000, //MS
        httpOnly: true, //XSS Attacks
        samesite: "strict", //CSRF attacks
        secure: node_mode !== "development",

    })
    console.log("Token generated ans cookie set");

    return token;
}


