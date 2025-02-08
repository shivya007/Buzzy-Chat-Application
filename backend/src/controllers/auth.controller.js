import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup =  async(req, res) =>{
    // get the data from the request body
    const {fullName, email, password} = req.body;
    try {
        // write validation for each field either empty or filled
        if(!fullName || !email || !password){
            const missingField = [];
            if(!fullName) missingField.push("Full Name");
            if(!email) missingField.push("Email");
            if(!password) missingField.push("Password");
            return res.status(400).json({message: `${missingField.join(", ")} is required`});
        }
        // check password length if it is of less than 6
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters"});
        }

        //check if user with the same email exists in the db or not
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "account with this email already exists"});
        }

        //hashed the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create object of user to store the user as object in db
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

/*         console.log(newUser); */
        // generate the jsonweb token for the user and pass it to the cookie
        if(newUser){
            // generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilepic: newUser.profilepic || "",
            });
        }
        else{
            res.status(400).json({message: "Invalid User data"});
        }

    } catch (error) {
/*         console.log("Error in signup controller", error.message); */
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const login =  async(req, res) =>{
    // here user will send the email and password to the server
    // here we check if the user with the same email is exist or not and if yes then we check password with and if both are true, then the user will be authenticated
    const {email, password} = req.body;
/*     console.log("User enter email in login route as: ", email);
    console.log("User enter password in login route as: ", password); */

    try {
         // check if email exists in the database or not
         const user = await User.findOne({email});   
         if(!user){
            return res.status(400).json({message: "Invalid credentials"});
         }

         const isPasswordCorrect = await bcrypt.compare(password, user.password);

         // check if password is correct or wrong
         if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
         }

         generateToken(user.id, res);
/*          console.log("User login successfully"); */
         res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilepic: user.profilepic,
         })
    } catch (error) {
/*         console.log("Error in login controller", error.message); */
        res.status(500).json({message: "Internal server error"});
    }
}


export const logout =  async(req, res) =>{
    try {
        // just removed the cookie from jwt
        res.cookie("jwt", "", {maxAge: 0});    
        res.status(200).json({message: "logged out successfully"});
        /* console.log("Logged out successfully"); */
    } catch (error) {
/*         console.log("Error in logout", error.message); */
        res.status(500).json({message: "Internal Server Error"});
    }
    

}

export const updateProfile = async(req, res) =>{
    try {
        const { profilepic } = req.body;
        const userId = req.user._id;

        if(!profilepic){
            return res.status(400).json({message: "Profile pic is required"});
        }

        // upload the profile pic to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilepic: uploadResponse.secure_url}, {new: true});

        console.log("Updated user with profile: ", updatedUser);

        res.status(200).json(updatedUser);
    } catch (error) {
/*         console.log("error in update profile pic", error); */
         res.status(500).json({message: "Internal Server error"});
    }
}

export const check = async(req, res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
/*         console.log("Error in checkAuth controller", error.message); */
        res.status(500).json({message: "Internal server error"});
    }
}