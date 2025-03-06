import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        console.log("This is mongoDB URI: see ",process.env.MONGODB_URI);
        const response = await mongoose.connect(process.env.MONGODB_URI); // Increase timeout to 60 seconds);
        console.log(`MongoDB connected successfully ${response.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
}