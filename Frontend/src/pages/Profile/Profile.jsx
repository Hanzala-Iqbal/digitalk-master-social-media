import React, { useEffect, useState,useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
// import axios from 'axios';
import { ethers } from 'ethers';
import { BASE_URL } from '../../utils/config';
import profilePhoto from "/public/Images/profile-img3.png";
import { DigiTalkContext } from "../../context/DigitalkContext";

export default function Profile() {
  const {person,friendList,fetchFriends,selfpostsArr,fetchData,fetchFriendsCount,followersCount} =useContext(DigiTalkContext)
  const [copied, setCopied] = useState(false);
  const [totalEarned, settotalEarned] = useState(0)
  // const [person, setPerson] = useState({});
  const [loggedInUser, setloggedInUser] = useState("")
  const [selectedPerson, setSelectedPerson] = useState(loggedInUser);
 // Added friend count state

  const count = 6;

  useEffect(() => {
    if(localStorage.getItem("user"))
    {
    // console.log("Selected__________profile>"+selectedPerson)
    // console.log()
    // const id=JSON.parse(localStorage.getItem("user")).id;
    
    setloggedInUser(JSON.parse(localStorage.getItem("user")).id)
    // console.log("Loggedin use profile"+loggedInUser)
    setSelectedPerson(JSON.parse(localStorage.getItem("user")).id)
    // console.log("selected use profile"+selectedPerson)
    }

    if(loggedInUser&& selectedPerson)
    {
      
      fetchData(selectedPerson); 
     fetchFriendsCount(selectedPerson);
    //  console.log("Profile person:"+person.token)
     
    }

  }, [selectedPerson])

  const getTotalEarned=()=>{
    let sum=0;

    selfpostsArr.forEach(post => {
      console.log("Sum:"+sum)
      console.log("Sum:"+typeof sum)
      console.log("parse Ether:"+parseFloat(ethers.utils.formatEther(post.tipAmount.toString())))
      
      sum=sum+parseFloat(ethers.utils.formatEther(post.tipAmount.toString()))
      
    });
    settotalEarned(sum)
  }


  useEffect(() => {

    getTotalEarned();

    
  }, [selfpostsArr])

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(person.publicKey);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else { // fallback for older browsers or mobiles
      const textarea = document.createElement('textarea');
      textarea.value = person.publicKey;
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="card p-3 profile-container">
      <img
        src={profilePhoto}
        className="card-img-top profile-image mx-auto"
        alt="..."
      />
      <div className="card-body">
        <h3 className="card-title my-2">{person.username}</h3>
        <div className="align-items-center">
          <h5 className="text-white">
            {typeof person.publicKey === 'string' ? person.publicKey.length <= count ? person.publicKey :
              person.publicKey.slice(0, count) + "..." : ""}
              <span
              className='mx-2 cursor-pointer'
            data-toggle="tooltip"
            title='Copy'
            onClick={copyToClipboard}
          >
            <FontAwesomeIcon icon={faCopy} />
          </span>
          </h5>
          {copied && (
            <span className="text-success ms-2">Copied to clipboard</span>
          )}
        </div>
        <hr className="divider" />
        <div />
        <div />
        <div className='profile-stats'>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Posts:</strong> {selfpostsArr ? selfpostsArr.length : "0"}
            </li>
            <li className="list-group-item">
            <strong>Earned in ETH:</strong> {totalEarned !== 0 ? totalEarned.toFixed(4) : "0"}
            </li>
            <li className="list-group-item">
              <strong>Followers:</strong> {followersCount ? followersCount : "0"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

