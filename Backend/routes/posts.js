import express from "express";
import {
  createNewPost,
  likePost,
  getPostLikes,
  userLiked
} from "../controllers/postController.js";
const router = express.Router();

// Router To Add Post to DB
router.post("/addToDB/:id/hash/:hash", createNewPost);

// Router to Add like on post
router.post("/likePost/:hash/userId/:userId", likePost);

// Router to Get likes on post
router.get("/getLikes/:hash", getPostLikes);

// Router to Check if User liked the post
router.get("/userLiked/:hash/userId/:userId", userLiked);

export default router;
