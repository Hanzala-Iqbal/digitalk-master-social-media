import React, { useState, useEffect,useContext } from "react";
// import axios from 'axios';
// import Post from "../Posts/Post";
// import NewPost from "../Posts/NewPost";
import HomeFeed from "../HomeFeed"
import Profile from "../Profile/Profile";
import Quicks from "../Quicks/Quicks";
import Search from "../Search/Search";

import { BASE_URL } from "../../utils/config";
import "./ProfilePage.css";
// import profilePhoto from "/public/Images/profile-img3.png";
// import postPhoto1 from "/public/Images/post-img2.png";
import { DigiTalkContext } from "../../context/DigitalkContext";
import ConnectPage from "../ConnectPage";

function ProfilePage() {
  const {person,friendList,fetchFriends,fetchData,fetchPostyAddess,connectedAccounts} =useContext(DigiTalkContext)
  
  const [isHovering, setIsHovering] = useState(false);
  // const [person, setPerson] = useState({});
  // const [friendList, setFriendList] = useState([]);
  const [loggedInUser, setloggedInUser] = useState("")
  const [selectedPerson, setSelectedPerson] = useState(loggedInUser);

  const quicks = [
    { title: "Friends", list: friendList },
  ];


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

  // useEffect(() => {
  //   if (isHovering) {
  //     document.body.classList.add('no-scroll');
  //   } else {
  //     document.body.classList.remove('no-scroll');
  //   }
  // }, [isHovering]);

  useEffect(() => {
  

    // fetchFriends();
    if(loggedInUser && selectedPerson)
    {
      
      fetchFriends(selectedPerson);
      fetchData(selectedPerson);
  
    }

    
  }, [selectedPerson]);

  

  const handlePersonClick = async (personId) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${personId}`,{
        method:"GET",
        headers:{
            "content-type":"application/json",
        }
      });
      const result = await response.json();
      setSelectedPerson(result._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="row">
        {/* profile section */}
        <div className="col-sm-12 col-md-3 my-2">
          {selectedPerson && (
            <Profile
              selectedPerson={selectedPerson}
            />
          )}
        </div>

        {/* post section */}
        <div className="col-sm-12 col-md-6 my-2 py-2">
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {selectedPerson !== loggedInUser ? "" :
            ""
            //   <NewPost />
            }
            <>
            </>
            {/* <Post
              userName={person.name}
              userNickName={person.nickName}
              profileImage={profilePhoto}
              postImage={postPhoto1}
              description="Very Beautifulllllll......"
              tags={["#Lala", "#Butt", "#Software_Engineer"]}
              likeCount={0}
              commentCount={0}
              starCount={0}
            /> */}
             
            {connectedAccounts?<HomeFeed status="profile"/>: <>
          ""
        </>
}
            
          </div>
        </div>

        {/* Right profile section */}
        <div className='col-sm-12 col-md-3 my-2'>
          <Search onPersonClick={handlePersonClick} />
          {quicks.map((item, index) => (
            <Quicks
              title={item.title}
              list={item.title === "Friends" ? friendList : item.list}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
