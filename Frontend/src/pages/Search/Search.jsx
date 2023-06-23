import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import './Search.css';
import { FaSearch, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { debounce } from 'lodash';
import { BASE_URL } from '../../utils/config';
// import { DigiTalkContext } from '../../context/DigitalkContext';


function Search({ onPersonClick }) {
  // const id = "6471e1cb8661253a93967d0d";
  const [id, setid] = useState("")
  const [publicKey, setpublicKey] = useState("")
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  // const {person,fetchData}=useContext(DigiTalkContext)

  // useEffect(() => {
    
  
  // console.log("Get id is;;;;;;;;;;"+id)
  // }, [])
  
  const handleSearch = async (query) => {
    setid(JSON.parse(localStorage.getItem("user")).id)
    setpublicKey(localStorage.getItem("key"));
    // console.log("Id is iiiiiiiiiiiiiiiii:"+id);
    // console.log("keyyyyyyyyyyyyyyyyyyyyy:",query)
    // console.log("typeeeee",typeof(query))
    if (!query) {
      setResults([]);
      return;
    }
    try {
      // console.log("itself---------")
      const result = await axios.get(`${BASE_URL}/users/${id}`);
      const itself = result.data;
      // console.log("itself---------")
      // console.log(itself)
      // console.log(`${BASE_URL}/users/search/${query}/publickey/${query}`)
      const activeExtension=JSON.parse(localStorage.getItem("user")).email.split("@")[1].toLowerCase();
      const res = await axios.get(`${BASE_URL}/users/search/${query}/publickey/${query}/extension/${activeExtension}`);
      // console.log(res)
      // console.log(res.data)
      res.data = res.data.filter(item => {
        return item._id !== id
      })

      res.data=res.data.filter((item)=>{
        return item.extension==activeExtension;
      })

      const updatedResults = res.data.map((person) => {
        const isFriend = itself.friends.includes(person._id);
        const hasFriendRequest = person.friendRequests.includes(itself._id);
        return {
          ...person,
          isFriend,
          hasFriendRequest,
        };
      });
      // console.log(updatedResults)
      setResults(updatedResults);
    } catch (err) {
      console.error(err);
    }
  };

  const delayedSearch = debounce(handleSearch, 500);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    delayedSearch(value);
    if (!value) {
      setResults([]);
    }
  };

  const handleFriendAdd = async (personId, hasFriendRequest) => {
    try {
      console.log(hasFriendRequest)
      if (!hasFriendRequest) {
        const newresult = await axios.post(`${BASE_URL}/users/notification/sendFriendRequest`,
          {
            _id: id,
            // publicKey:publicKey,
            UserId:personId,
          })
        if (newresult.data) {
          window.alert("Request sent successfully...");
          results.map((p) => {
            if (newresult.data.friendRequests.includes(p._id)) {
              p.hasFriendRequest = true;
            }
          })
        }
      }
      else {
        const list = await axios.post(`${BASE_URL}/users/notification/cancelFriendRequest`,
          {
            _id: id,
            UserId:personId,
          })
        if (list) {
          window.alert("You cancelled request!");
          results.map(p => {
            if (p._id = personId) {
              p.hasFriendRequest = false;
            }
          })
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  return (
    <div className="search-bar-container my-3">
      <div className="search-form">
        <input className='form-control' type="text" value={query} onChange={handleChange} placeholder="Search by name or key" />
        <a className='rounded' onClick={() => handleSearch(query)} ></a>
      </div>
      <div className='w-100'>
        <ul className="search-results w-100">
          {results.map((person, index) => (
            <li key={index} className="w-100 search-result d-flex justify-content-between">
              <div>
                <button className='btn btn-primary' onClick={() => onPersonClick(person._id)}>{person.username}</button>
              </div>
              <div>
                {
                  person.isFriend ? "" :
                    person.hasFriendRequest ?
                      <button
                        className='btn btn-success float-right'
                        onClick={() => { handleFriendAdd(person._id, person.hasFriendRequest) }}
                      // disabled={person.isFriend || person.hasFriendRequest}
                      >
                        <FaUserCheck
                        />
                      </button>
                      :
                      <button
                        className='btn btn-primary float-right'
                        onClick={() => handleFriendAdd(person._id, person.isFriend, person.hasFriendRequest)}
                      // disabled={person.isFriend || person.hasFriendRequest}
                      >
                        <FaUserPlus />
                      </button>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Search;