import User from "../models/User.js";
import hashData from "../utils/hashData.js";


export const createNewUser = async (data) => {
  try {
    const { username, email, password, dob, extension } = data;
    // Checking if user exists already
    const existingUser = await User.find({ email });
    if (existingUser.length) {
      // User exists already
      throw Error("User with this Email Exists Already!");
    } else {
      //hash Password
      const hashedPassword = await hashData(password);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        dateOfBirth,
        verified: false,
        extension,
      });

      // TRY TO CREATE A NEW USER
      const saltRounds = 10;
      bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          newUser
            .save()
            .then((result) => {
              // Handle Account Verification
              //sendVerificationEmail(result,res);
              sendOTPVerificationEmail(result, res);


            })
            .catch((err) => {
              console.log(err);
              res.json({
                status: "FAILED",
                message: "An error occurred while saving user account!",
              });
            });
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: "An error occurred while hashing password!",
          });
        });
    }
  } catch (err) {}
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Inside Find single-----", id);
    //Checking if user exists already
    // if (id.match(/^[0-9a-fA-F]{24}$/)) {
    //Yes, it's a valid ObjectId, proceed with `findById` call.

    const foundUser = await User.findById(id);

    if (foundUser) {
      // console.log("Response------------------->");
      // console.log(foundUser);
      res.json(foundUser);
    }
  } catch (err) {
    console.log(err);
    throw new Error("An error occurred while retrieving the user.");
  }
  res.end();
  // if (id.match(/^[0-9a-fA-F]{24}$/)) {

  // User.findById(id)
  //   .then((user) => {
  //     if (user) {
  //       console.log("Response------------------->");
  //       console.log(user);
  //       res.json(user);
  //     } else {
  //       res.status(404).json({ message: "User not found" });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(400).json("Error: " + err);
  //   });
  // }
};

export const getAllUsers = (req, res) => {
  User.find()
    .then((Users) => res.json(Users))
    .catch((err) => res.status(400).json("Error: " + err));
};

// Route for searching Users by name or publicKey
export const searchUsers = async (req, res) => {
  // console.log(
  //   "Inside Search user---------------------------------------------------"
  // );
  try {
    const { username, publicKey, extension } = req.params;
    // const { username, publicKey } = req.query;
    // console.log(req.params);
    // console.log(req.query);
    let results = [];
    // username = username;
    // publicKey = publicKey;
    if (username || publicKey) {
      results = await User.find({
        $and: [
          {
            $or: [
              { username: { $regex: `${username}`, $options: "i" } },
              { publicKey },
            ],
          },
          {
            extension,
          },
        ],
      });
    } else {
      res.end();
      // return res.status(400).json({ message: "Invalid search parameters" });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new User to the db
// export const addUser = (req, res) => {
//   const { name, nickName, age, publicKey } = req.body;

//   const newUser = new User({
//     name,
//     nickName,
//     age: Number(age),
//     publicKey,
//   });

//   newUser
//     .save()
//     .then(() => res.json("User added!"))
//     .catch((err) => res.status(400).json("Error: " + err));
// };

// Update user by email

export const updateUser = async (req, res) => {
  console.log("Inside update user api");
  try {
    const { id } = req.params;
    const userRes = await User.updateOne({ _id: id }, { $set: req.body });
    if (userRes) {
      res.status(200).json({ message: "Updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Update Failed" });
  }
};

// Get all friends of a User by publicKey
export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const userRes = await User.findById(userId);

    if (userRes) {
      const friends = userRes.friends;
      const friendsList = await User.find({ _id: { $in: friends } });

      if (friendsList) {
        res.json(friendsList);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a User by publicKey
// export const getUserById = (req, res) => {
//   const { userId } = req.params;

//   User.findById(userId)
//     .then((User) => {
//       if (User) {
//         res.json(User);
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
// };

export const sendFriendRequest = async (req, res) => {
  try {
    const { _id, UserId } = req.body;

    const userRes = await User.findById(UserId);

    if (
      !userRes.friendRequests.includes(_id) &&
      !userRes.friends.includes(_id)
    ) {
      // const obj={
      //   _id,
      //   publicKey
      // }
      // id as well as publickey save
      userRes.friendRequests.push(_id);
      await userRes.save();
      res.json(userRes);
    } else {
      res.status(400).json({
        message: "Friend request already sent or User is already a friend",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { _id, UserId } = req.body;

    const UserRes = await User.findById(_id);

    if (UserRes.friendRequests.includes(UserId)) {
      UserRes.friendRequests = UserRes.friendRequests.filter((p) => {
        return p.toString() !== UserRes.toString();
      });
      await UserRes.save();
      res.json(UserRes);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  res.end();
};

// Accept a friend request from friendId to userId

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id, friendId } = req.body;

    const currentUser = await User.findById(id);

    const friendUser = await User.findById(friendId);

    if (currentUser && friendUser) {
      currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== friendId.toString()
      );

      // const friendObj={
      //   friendId,
      //   friendKey
      // }

      currentUser.friends.push(friendId);
      await currentUser.save();

      friendUser.friendRequests = friendUser.friendRequests.filter(
        (id) => id.toString() !== id.toString()
      );

      friendUser.friends.push(id);
      await friendUser.save();

      res.json({ status: 200 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Deny a friend request from friendId to currentPublicKey
export const denyFriendRequest = async (req, res) => {
  // console.log("Denyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
  try {
    const { userId, friendId } = req.body;

    const UserRes = await User.findById(userId);

    // console.log(UserRes);
    if (UserRes.friendRequests.includes(friendId)) {
      UserRes.friendRequests = UserRes.friendRequests.filter((p) => {
        return p.toString() !== friendId.toString();
      });
      // console.log(UserRes);
      await UserRes.save();
      res.json(UserRes);
    }
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: "Server error" });
  }
  res.end();
};

// Get friend requests for a specific user
export const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const UserRes = await User.findById(userId);

    if (UserRes) {
      const friendRequests = UserRes.friendRequests;
      const friends = await User.find({
        _id: {
          $in: friendRequests,
        },
      });
      res.json(friends);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get the count of friends for a specific user
export const getFriendCount = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("User Id:" + userId);
    const userRes = await User.findById(userId);

    // console.log("Get friend api----->");

    if (userRes.friends.length > 0) {
      const friendCount = userRes.friends.length;
      res.json({ count: friendCount });
    } else {
      res.status(404).json({ message: "no friend" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const checkAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Inside checkAdmin while accessing /admin!!!");
    const user = await User.findOne({ email });

    console.log("User found in checkAdmin: ", user);

    if (!user) {
      console.log("User not found");
      return res.json({ isAdmin: false });
    }

    console.log("user.role:", user.role);

    if (user.role == "admin") {
      console.log("User is Admin!");
      return res.json({ isAdmin: true });
    } else {
      console.log("Not an admin");
      return res.json({ isAdmin: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Admin info retrieval failed" });
  }
};

