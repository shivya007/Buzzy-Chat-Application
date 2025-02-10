import Navbar from "./components/Navbar.jsx"
import {Routes, Route, Navigate} from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import {Loader} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js";
import "./app.css";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const { theme } = useThemeStore();


/*   console.log({onlineUsers}); */



  useEffect(() =>{
    checkAuth();
  }, [checkAuth]);

/*   console.log("This is authuser in appjsx",{authUser}); */

  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
      <Loader className ="size-10 animate-spin"></Loader>
    </div>
    )
   }
  

  return (
    <div data-theme={theme} >
      <Navbar/>

      <Routes>
          <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
          <Route path="/signup" element={!authUser ? <SignupPage/> :<Navigate to="/"/> } />
          <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
          <Route path="/settings" element={<SettingsPage/>} />
          <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>

      <Toaster/>


    </div>
  )
}

export default App