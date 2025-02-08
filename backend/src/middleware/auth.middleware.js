import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// here we check if user is authenticated before doing updation with the help of jwt token

export const protectRoute = async(req, res, next) =>{
    try {
        // get jwt token from the cookies
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }

        // get the userId from the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken){
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        }

        // get user with the user_id and removing the password
        const user = await User.findById(decodedToken.user_id).select("-password");
       /*  console.log(user); */

        if(!user){
            return res.status(401).json({message: "User not found"});
        }

/*         console.log("update can be done!!"); */

        // Attach user object to the request    
        req.user = user;

        next();
    } catch (error) {
/*         console.log("Error is protectRoute middleware", error.message); */
        res.status(500).json({message: "Internal server error"});
    }
}