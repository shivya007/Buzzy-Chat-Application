import jwt from "jsonwebtoken"

export const generateToken = async (user_id, res) =>{
    const token = jwt.sign({user_id}, process.env.JWT_SECRET, {
        expiresIn: "7d",  
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
        httpOnly: true, // prevent XSS attacks cross site scripting attacks
        sameSite: "strict", // CSRF attacks request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    })

    return token;
}



