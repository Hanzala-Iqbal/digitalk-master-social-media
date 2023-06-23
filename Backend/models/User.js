import mongoose from "mongoose";
const Schema = mongoose.Schema;
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  dateOfBirth: Date,
  verified: Boolean,
  token: String,
  publicKey: {
    type: String,
    // required: true,
    default: "NULL",
    unique: false,
    trim: true,
  },
  extension: {
    type: String,
    lowercase: true,
  },
  friends: [{ type: mongoose.Types.ObjectId }],
  // friends: [
  //   {
  //     _id: { type: mongoose.Types.ObjectId },
  //     key: { type: String },
  //   },
  // ],
  friendRequests: [{ type: mongoose.Types.ObjectId }],
  // friendRequests: [
  //   {
  //     _id: { type: mongoose.Types.ObjectId },
  //     key: { type: String },
  //   },
  // ],
  role : String,
});

// generating Token
UserSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.token = token;
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

export default mongoose.model("User", UserSchema);
