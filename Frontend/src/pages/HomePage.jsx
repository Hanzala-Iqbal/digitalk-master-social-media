import React, { useContext,useState,useEffect } from 'react'
import { DigiTalkContext } from '../context/DigitalkContext';
import { useNavigate } from "react-router-dom";
import HomeFeed from './HomeFeed';
import { BASE_URL } from "../utils/config";
import ConnectPage from './ConnectPage';
import Profile from './Profile/Profile'

import Cookie from "js-cookie"
const Home = () => {
  const { connectedAccounts,connectWallet,fetchFriends,fetchData } = useContext(DigiTalkContext);
  const [loggedInUser, setloggedInUser] = useState("")
  const [selectedPerson, setSelectedPerson] = useState(loggedInUser);

  const navigate = useNavigate();

  // const getSingleUser=async()=>{
  //   const id=JSON.parse
  //   const email=localStorage.getItem("email")
  //   try {
  //     const res = await fetch(`${BASE_URL}/users/${email}`, {
  //       method: "GET",
  //       headers: {
  //         "content-type": "application/json",
  //       }
  //     });

  //     const result = await res.json();
  //     if(result)
  //     {
  //       console.log(result)
  //     }
  //     const user={
  //       UserId:result._id,
  //       email:result.email,
  //     }
  //     Cookie.set("User",user)
  //   } catch (err) {
  //     console.log(err)
  //   }

  // }
  // Hyper ledger Fabric

  useEffect(() => {

    if(!localStorage.getItem("user"))
    {
      navigate("/login")
    }
    else
    {
      Cookie.set("user",JSON.parse(localStorage.getItem("user")))
     
    }
  }, [])


  useEffect(() => {
    if(localStorage.getItem("user"))
    {
      // console.log("Selected__________>"+selectedPerson)
    // console.log()
    // const id=JSON.parse(localStorage.getItem("user")).id;
    
    setloggedInUser(JSON.parse(localStorage.getItem("user")).id)
    // console.log("Loggedin use"+loggedInUser)
    setSelectedPerson(JSON.parse(localStorage.getItem("user")).id)
    // console.log("selected use"+selectedPerson)
    }
    

  }, [1])


  useEffect(() => {
  

    // fetchFriends();
    if(loggedInUser && selectedPerson)
    {
      
      fetchFriends(selectedPerson);
      fetchData(selectedPerson);
  
    }

    
  }, [selectedPerson]);
  return (
    
    <div>
      {connectedAccounts ?
          <div className='row'>

          <div className="col-sm-12 col-md-3 my-2">
          {selectedPerson && (
            <Profile
              selectedPerson={selectedPerson}
            />
          )}
          </div>
        
          <div className="col-sm-12 col-md-6 my-2 py-2">
          <HomeFeed status="home"/>
          </div>
          </div>
          :
        <>
          <ConnectPage/>
        </>

      }


    </div>
  );
}

export default Home