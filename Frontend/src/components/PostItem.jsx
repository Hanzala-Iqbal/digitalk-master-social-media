import { React, useEffect, useState, useContext } from "react";
import Identicon from "identicon.js";
import { AccountSlice } from "../utils/AccountSlice";
import { DigiTalkContext } from "../context/DigitalkContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import "./PostItem.css";

const PostItem = ({ post }) => {
  const [extension, setExtension] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageExtensions = ["jpg", "jpeg", "png"];
  const docExtension = ["pdf", "doc"];

  const { tipOwner, likePost, getPostLikes, userLikedOrNot } = useContext(DigiTalkContext);

  const handleExtension = () => {
    const [, extension] = post.fileName.split(".");
    console.log("File extension:", extension);
    setExtension(extension);

    if (imageExtensions.includes(extension)) {
      setIsImage(true);
    } else if (docExtension.includes(extension)) {
      setIsImage(false);
    }
  };

  useEffect(() => {
    handleExtension();
  }, []);

  useEffect(() => {
    getPostLikes(post.hash).then((likes) => {
      setLikesCount(likes);
      setIsLoading(false);
    });
  }, [post.likes, post.hash, likesCount]);

const likedOrNot = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    try {
      const result = await userLikedOrNot(post.hash, user.id);
      if (result === true) {
        console.log("Inside Liked not----------");
        console.log(post.hash);
        setUserLiked(true);
      } else if (result === false) {
        setUserLiked(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
};

useEffect(() => {
  likedOrNot();
}, [likesCount]);

  const handleLikePost = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        await likePost(post.hash, user.id);
        const updatedLikesCount = await getPostLikes(post.hash);
        setLikesCount(updatedLikesCount);
        const result = await userLikedOrNot(post.hash, user.id);
        if (result === true) {
          console.log("Inside Userliked---------");
          setUserLiked(true);
        } else if (result === false || typeof result === "undefined") {
          setUserLiked(false);
        }
        setIsLoading(false); // Set isLoading to false after userLiked state is updated
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const value1 = getRndInteger(0, 100);
  const value2 = getRndInteger(0, 10);
  const value3 = getRndInteger(0, 255);

  let options = {
    foreground: [value1, value2, value3, 255], // rgba black
    background: [255, 255, 255, 255], // rgba white
    margin: 0.2, // 20% margin
  };

  return (
    <div className="post_main_container">
      {isLoading ? (
        <div>
          <img src="Frontend\public\Images\loading.gif" alt="Loading..." />
        </div>
      ) : (
        <div className="card mt-3 post_main_container" style={{ maxWidth: "700px" }}>
          <div className="card-header d-flex justify-content-center">
            <img
              className="ml-2"
              width="50"
              height="50"
              src={`data:image/png;base64,${new Identicon(post.auther, options).toString()}`}
            />
            <p className="text-black text-center mx-2 post_main_container">{AccountSlice(post.auther)}</p>
          </div>
          <br />
          <div className="card-body post-card row">
            <h5 className="card-text py-2 px-4 col-12">{post.description}</h5>
            {isImage ? (
              <div className="text-center">
                <img className="post-image col-12" src={`https://ipfs.io/ipfs/${post.hash}`} />
              </div>
            ) : (
              <>
                <button className="col-12" download={post.hash}>
                  Download Document
                </button>
              </>
            )}
            <div className="row my-4">
              <h3 className="float-left mt-1 text-center col-5 mx-auto">
                <a
                  className={`like-button ${userLiked ? "like-button-blue" : "like-button-black"}`}
                  onClick={handleLikePost}
                >
                  <FontAwesomeIcon icon={faThumbsUp} /> {likesCount}
                </a>
              </h3>
              <h3 className="float-left mt-1 text-center col-5 mx-auto">
              <span className="mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/></svg>
              </span>
                {post.tipAmount ? ethers.utils.formatEther(post.tipAmount.toString()) : ""} ETH
              </h3>
            </div>
            <button
              className="btn btn-sm float-right btn-primary col-12 mx-auto"
              name={post.id}
              onClick={(event) => {
                tipOwner(post.id, post.auther);
              }}
            >
              TIP 0.0001 ETH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItem;
