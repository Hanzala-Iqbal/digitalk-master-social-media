import React, { useContext, useState,useEffect } from 'react'
import { DigiTalkContext } from '../context/DigitalkContext';
import Identicon from 'identicon.js';
import { AccountSlice } from '../utils/AccountSlice';
import { create as ipfsHttpClient } from "ipfs-http-client";
import { BASE_URL } from "../utils/config";
import "./Compose.css"

import Loader from './Loader'

const Compose = () => {

  const [values, setvalues] = useState({
    PROJECTID:"",
    PROJECTSECRET:""
  })

  const [activeUser, setactiveUser] = useState("")
  const [activeUserEmail, setactiveUserEmail] = useState("")

  // useEffect(async() => {
  //   try {
  //     const res = await fetch(`${BASE_URL}/auth/config`, {
  //       method: "get",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //     });

  //     const result = await res.json();

  //     if(res.ok)
  //     {
  //       setvalues({
  //         PROJECTID:result.PROJECTID,
  //         PROJECTSECRET:result.PROJECTSECRET
  //       })
  //     }
  //   } catch (err) {
  //     alert(err.message);
  //   }
  
  // }, [])

  useEffect(() => {
    setactiveUser(JSON.parse(localStorage.getItem("user")).id)
    setactiveUserEmail(JSON.parse(localStorage.getItem("user")).email)
  }, [])
  
  

  const [fileName, setfileName] = useState("")

  const { connectedAccounts, formData, setformData, isLoading, createNewPost, addPostToDB } = useContext(DigiTalkContext);

  // const projectId = "2LRiHmzyN5npk3eismPkUzXQjB6";
  // const projectSecret = "7f1cba54c2a43dbfea5b1ddebccaa31b";
  const authorization = "Basic " + btoa("2LRiHmzyN5npk3eismPkUzXQjB6"+ ":" + "7f1cba54c2a43dbfea5b1ddebccaa31b");


  


  // const ipfsNode = ipfs({
  //   host: 'ipfs.infura.io',
  //   port: 5001,
  //   protocol: 'https'
  // });

  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers:{
      authorization
    }
  })

  let options = {
    foreground: [162, 25, 255, 255],               // rgba black
    background: [255, 255, 255, 255],         // rgba white
    margin: 0.2                              // 20% margin
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle Submit")
    const result = await ipfs.add(formData["buffer"]);

    // console.log("result is:",result);
    // console.log("result is:",result.path);
    // Pk.EdU  pk.edu
    let hash = result.path;
    console.log("Result from ipfs")
    console.log(result)
    console.log("Active User")
    console.log(activeUserEmail)
    console.log(activeUserEmail)
    const extension=activeUserEmail.split("@")[1].toLowerCase();
    console.log("Extenison")
    console.log(extension)

    const postAdded = await createNewPost(hash,fileName,activeUser,extension);

    console.log("Post was Added?: " , postAdded)
    if(postAdded)
      addPostToDB(hash,activeUser)
    
  }

  const captureFile = async (e) => {
    e.preventDefault();
    const nameAtt = e.target.name;

    const file = e.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file);
    
    setfileName(file.name);

    reader.onloadend = () => {

      setformData((prevState) => ({ ...prevState, [nameAtt]: reader.result }));
      // console.log("Reader result:", reader.result)
      // console.log("formData:", formData)
      // save in state
    }
  }

  const handleChange = (e) => {
    const nameAtt = e.target.name;
    console.log(e.target.name)
    console.log(e.target.value)
    setformData((prevState) => ({ ...prevState, [nameAtt]: e.target.value }));

    // console.log(formData)


  }
  return (
    <div className="container-fluid mt-5" style={{zIndex:"-1"}}>
      <h2 className="compose-heading">Write a post</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="compose-form">
        <input className='compose-input' type="file" accept=".jpg, .jpeg, .png, .pdf, .doc" name="buffer" onChange={(e) => captureFile(e)}/>
        <div className="form-group">
          <textarea
            id="description"
            type="text"
            name="description"
            className="form-control compose-input"
            placeholder="What's on your mind"
            onChange={(e) => {
              handleChange(e);
            }}
            required
          />
          <fieldset className="visibility-fieldset">
            <legend className="visibility-legend">Select post visibility</legend>
            <div className="visibility-options">
              <div className="mx-3">
              <input type="radio" id="op1" name="status" value="public" onChange={handleChange} required />
              <label htmlFor="op1">Public</label>
              </div>
              <div className="mx-3">
              <input type="radio" id="op2" name="status" value="private" onChange={handleChange} required />
              <label htmlFor="op2">Friends Only</label>
              </div>
            </div>
          </fieldset>
        </div>
        <button type="submit" className="btn btn-primary btn-sm compose-submit-btn">
          Upload
        </button>
        {isLoading && <Loader />}
      </form>
    </div>
  );
};

export default Compose;