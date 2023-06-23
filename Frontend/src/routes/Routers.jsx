import {React,useEffect,useState,useContext} from "react";
import { Router,Routes, Route, Navigate,useNavigate } from "react-router-dom";
import Home from "../pages/HomePage";
import Login from "../pages/Login";
import {DigiTalkContext} from '../context/DigitalkContext';
import { AccountSlice } from '../utils/AccountSlice';
import Signup from "../pages/signup";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import Notification from "../pages/Notification/Notification";
import OtpVerification from "../pages/otpVerification";

import Cookie from "js-cookie"
import Admin from "../pages/AdminPanel/Admin";

// import { BASE_URL } from "../utils/config";
const Routers = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("")

  const {updateuser,connectedAccounts}=useContext(DigiTalkContext)
  // const { connectedAccounts, connectWallet } = useContext(DigiTalkContext);

  // const updateUser=async()=>{
       
  // }

  // useEffect(() => {
  //   if(Cookie.get("user"))
  //   {
  //     console.log("Id------------------------------------->")
  //     console.log(JSON.parse(localStorage.getItem("user")).id)

  //     setId(JSON.parse(localStorage.getItem("user")).id);
  //     console.log(id)
       
  //   }
  //   else
  //   {
  //     console.log("Id does not exists")
  //   }

  // }, [])
  
  // useEffect(() => {
  //  if(!localStorage.getItem("user"))
  //  {
  //   navigate("/login")
  //  }
  // }, [])
  
  // useEffect(() => {
  //   if(!localStorage.getItem("user"))
  //  {
  //   navigate("/login")
  //  }
  //  else
  //  {
  //   console.log("Inside Update function--------------------")
    
  //   const id=JSON.parse(localStorage.getItem("user")).id;
   
   
  //   const publicKey=connectedAccounts;
  //   console.log(connectedAccounts)
  //   console.log(publicKey)
  //   updateuser(publicKey,id)
  //  }
   
  // }, [connectedAccounts])
  
  return (
    <>
    
     <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/login"
        element={<Login/>}
      />
      <Route path="/register" element={<Signup />} />
      <Route path="/otpVerification" element={<OtpVerification />} />
      <Route path = "/profile" element = {<ProfilePage/>} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/admin" element={<Admin />} />
    </Routes>

    </>
   
  );
}

export default Routers;
