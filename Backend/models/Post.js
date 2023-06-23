import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userId: String,
  hash: String,
  likesCount: Number,
  likes: [{
    userId: String
  }]
});


const Post = mongoose.model("Post", PostSchema);

export default Post;
