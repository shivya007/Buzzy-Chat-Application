import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) =>({
    authUser: null,
    isSigningup: false,
    isLogin: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async() =>{
        try {
            const response = await axiosInstance.get("/auth/check");   
            set({authUser: response.data});
            get().connectSocket(); // this is connected here after login which shows the user is online
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({authUser: null});
        }
        finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) =>{
        set({isSigningup: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket(); // this is connected here after login which shows the user is online
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningup: false});
        }
    },

    login: async (data) =>{
        set({isLogin: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged in successfully");

            get().connectSocket(); // this is connected here after login which shows the user is online
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isLogin: false});
        }
    },

    logout: async () =>{ 
        try {
            await axiosInstance.post("/auth/logout");
            set( { authUser: null } );
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);

        }
    },

    updateProfile: async (data) =>{
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: async() =>{
        const { authUser } = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id,
            }
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers", (usersId) =>{
            set({onlineUsers: usersId});
        })
    },
    disconnectSocket: async() =>{
        if(get().socket?.connected) get().socket.disconnect();
    },

    
}));