import express from "express";
import {
  createNewUser,
  getSingleUser,
  getAllUsers,
  searchUsers,
  getUserFriends,
  // getUserById,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  getFriendRequests,
  getFriendCount,
  updateUser,
  checkAdmin,
} from "../controllers/userController.js";
const router = express.Router();

// import { verifyUser } from "../utlis/verifyToken.js";

// //update user
// router.put("/:id", verifyUser, updateUser);

// //delete user
// router.delete("/:id", verifyUser, deleteUser);

//get single user
router.get("/:id", getSingleUser);

// //get all users
// router.get("/", verifyUser, getAllUser);

router.post("/", createNewUser);
// router.get("/:email", getSingleUser);
// Route for searching Users by name or publicKey
router.get(
  "/search/:username/publickey/:publicKey/extension/:extension",
  searchUsers
);

// Get all friends of a User by publicKey
router.get("/friends/:userId", getUserFriends);

// Get a User by publicKey
// router.get("/:userId", getUserById);

// Update user through email
router.patch("/:id", updateUser);

// Send a friend request
router.post("/notification/sendFriendRequest", sendFriendRequest);

// Cancel a friend request
router.post("/notification/cancelFriendRequest", cancelFriendRequest);

// Accept a friend request
router.post("/notification/acceptFriendRequest", acceptFriendRequest);

// Deny a friend request
router.post("/notification/denyFriendRequest", denyFriendRequest);

// Route for fetching friend requests for a specific user
router.get("/notification/friendRequests/:userId", getFriendRequests);

// Get the count of friends for a specific user
router.get("/friendCount/:userId", getFriendCount);

// Get the status of admin or not admin
router.get("/checkadmin/:email", checkAdmin);

export default router;
