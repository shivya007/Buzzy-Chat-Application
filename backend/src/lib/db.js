import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully ${response.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
}