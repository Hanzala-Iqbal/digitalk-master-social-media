import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';
import { BASE_URL } from "../utils/config";
import logo from "../../public/Images/logo.png";
import axios from 'axios';


const otpVerification = () => {
  const [code, setCode] = useState({
    otp:undefined,
    email:undefined
  })
  const navigate = useNavigate();
  // console.log("Inside verificationwwwwwwwwwwww")

  // const fetchUser=async()=>{
  //   const email=localStorage.getItem("email");
  //   const res1 = await fetch(`${BASE_URL}/users/${email}`, {
  //     method: "get",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   });
  //   const result2 = await res1.json();
  //   console.log("user------------------>eee")
  //   console.log(result2)
  //   if(result2)
  //   {
  //     localStorage.setItem("user",result2);
  //   }

  // }
  // useEffect(async() => {
  //  await fetchUser()
  // }, [])

  const handleChange = (e) => {
    // console.log("On change---------")
    const email=localStorage.getItem("email")
    
    console.log(e.target.value)

    setCode({otp:e.target.value,email:email});
  };
  const handleClick = async (e) => {
    e.preventDefault();


    try {
      // console.log("About to fetch----------eeee")
      const res = await fetch(`${BASE_URL}/auth/verifyOTP`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(code),
      });

      const result = await res.json();
      if(result.status==="VERIFIED")
      {
        console.log("Verified")
        navigate("/login")
      }

      // if (!res.ok) alert(result.message);

     
    } catch (err) {
      alert(err.message);
    }
  }
  const handleResend = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('email');
    console.log("Email in Local Storage: ", email);

    try {
      const response = await axios.post(`${BASE_URL}/auth/resendOTPVerificationCode/${email}`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data;
      console.log(result);
      if (!response.ok) {
        alert(result.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  
  return (
    <div>
        <div className="otpFormsContainer" style={{display:'flex',flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <img className="mb-4" src={logo} alt="" width="250" height="100"/>
      <form className="" id="" onSubmit={handleClick}>
        <h1 className="h3 mb-3">Verify your OTP!</h1>
        <input type="number" name="inputOTP" id="inputOTP" onChange={handleChange} value={code.otp} style={{width:"300px"}} className="form-control bottom" placeholder="OTP (Kindly see your inbox)" required/>
        <button className="btn btn-lg btn-primary btn-block mt-3 mb-3" >Submit OTP!</button>
      </form>
      <form>
        <button onClick={handleResend} className="border-none hover-underline">Didn't Received it or Expired? Send Again!</button>
      </form>
    </div>
    </div>
  )
}

export default otpVerification