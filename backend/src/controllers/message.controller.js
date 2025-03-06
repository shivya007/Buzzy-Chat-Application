import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// this route is for getting the all the authenticated users too see chats
export const getUsersForSidebar = async (req, res) => {
  try {
    // as this route is already checked with middleware that only authenticated users can access this route
    // so we first get the id of loggedIn user
    const loggedInUser = req.user._id;

    // get all the users from the database, except for the loggedIn user
    const filteredUsers = await User.find({_id: { $ne: loggedInUser }}).select("-password");

/*     console.log("here is a list of all the users: ", filteredUsers); */

    res.status(200).json(filteredUsers);
  } catch (error) {
/*     console.log("Error in getUsersForSidebar: ", error.message); */
    res.status(400).json({error: "Internal Server Error"});
  }
};

// this route is for getting the chats between two people
export const getMessages = async (req, res) =>{
  try {
    // get the id of the other person 
    const { id: userToChatId } = req.params;

    // get loggedIn user id (my id)
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or:[
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId},
      ],
    });

/*     console.log(" All the messages between two users from message controller: ", messages); */
    res.status(200).json(messages);

  } catch (error) {
/*     console.log("Error in getMessages controller: ", error.message); */
    res.status(500).json({error: "Internal Server Error"});
  }
};

// here we have send message controller

export const sendMessage = async(req, res) =>{
  try {
    const { text, image } = req.body;


    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    let imageUrl;
    if(image){
      // upload image on cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }



    res.status(201).json({newMessage});


  } catch (error) {
/*     console.log("Error in sendMessage controller: ", error.message); */
    res.status(500).json({error: "Internal server error"});
  }
}