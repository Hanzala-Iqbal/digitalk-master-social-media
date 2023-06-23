import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import './Notification.css'


const Notification = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [id, setId] = useState("")
  const [publicKey, setpublicKey] = useState("")
  useEffect(() => {
    
    // Fetch friend requests for the current user from the backend API
    console.log("Notification -------:"+id)
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/notification/friendRequests/${id}`);
        // const data = await response.json();
        setFriendRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendRequests();
  }, [id]);

  useEffect(() => {
    setId(JSON.parse(localStorage.getItem("user")).id)
    setpublicKey(localStorage.getItem("key"))
  }, [])
  

  const handleAcceptRequest = async (friend) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/notification/acceptFriendRequest/`, {
        id,
        // publicKey,
        friendId: friend._id,
        // friendKey:friend.publicKey
      });

      if (response.data.status === 200) {
        window.alert('Friend request accepted successfully');
        setFriendRequests((prevRequests) => prevRequests.filter((item) => item._id !== friend._id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDenyRequest = async (friend) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/notification/denyFriendRequest/`, {
        userId: id,
        friendId: friend._id
      });

      if (response.data.status === 200) {
        window.alert('Friend request declined successfully');
        setFriendRequests((prevRequests) => prevRequests.filter((item) => item._id !== friend._id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container row text-center">
      <h3 className="mt-3 col-12 text-white">Friend Requests</h3>
      {friendRequests.length === 0 ? (
        <p className='col-12'>No pending friend requests</p>
      ) : (
        <ul className="list-group mt-3 text-center">
          {friendRequests.map((item, index) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
              <div>
                Friend Request from: <span className='mx-4' style={{ fontWeight: "bold" }}> {item.username} </span><span>{item.publicKey}</span>
              </div>
              <div>
                <button
                  className="btn btn-danger mx-3"
                  onClick={() => handleDenyRequest(item)}
                >
                  Decline
                </button>
                <button
                  className="btn btn-primary mx-3"
                  onClick={() => handleAcceptRequest(item)}
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
