import Post from '../models/Post.js'; // Import the Post model

export const createNewPost = async (req, res) => {
    console.log("Inside Create New Post (to Add Post to DB)!");
    try {
        const { hash, id } = req.params;
        const newPost = new Post({
            userId: id,
            hash: hash,
            likesCount: '0' // Initial like count is '0'
          });
          
        await newPost.save();

    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    console.log("inside Like Post!");
    try {
      const { hash, userId } = req.params;
      const post = await Post.findOne({ hash: hash });
  
      if (!post) {
        // Post not found
        return res.status(404).json({ error: "Post not found." });
      }
  
      const likedByUser = post.likes.find((like) => like.userId === userId);
  
      if (likedByUser) {
        // User has already liked the post, remove the like
        await Post.updateOne(
          { hash: hash },
          { $inc: { likesCount: -1 }, $pull: { likes: { userId } } }
        );
        console.log("Post like removed successfully.");
        res.status(200).json({ message: "Post like removed successfully." });
      } else {
        // User hasn't liked the post, like it
        await Post.updateOne(
          { hash: hash },
          { $inc: { likesCount: 1 }, $push: { likes: { userId } } }
        );
        console.log("Post liked successfully.");
        res.status(200).json({ message: "Post liked successfully." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getPostLikes = async (req, res) => {
    console.log("Inside get Likes on Post!");
    try {
      const { hash } = req.params;
      const post = await Post.findOne({ hash: hash });
  
      if (post) {
        const likeCount = post.likesCount;
        res.status(200).json({ likesCount: likeCount });
      } else {
        res.status(404).json({ error: "Post not found." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  

  export const userLiked = async (req, res) => {
    console.log("inside Check User Liked or Not?");
    try {
      const { hash, userId } = req.params;
      const post = await Post.findOne({ hash: hash });
  
      if (!post) {
        // Post not found
        return res.status(404).json({ error: "Post not found." });
      }
  
      const likedByUser = post.likes.find((like) => like.userId === userId);
  
      if (likedByUser) {
        // User has already liked the post, return true
        
        console.log("Returned True (User has Liked the Post Already).");
        return res.json({ liked: true });
      } else {
        // User has not liked the post, return false
  
        console.log("Returned False (User has Not Liked the Post Yet).");
        return res.json({ liked: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  