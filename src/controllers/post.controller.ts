import { Response } from "express";
import { customRequest } from "../types/types.js";
import { User } from "../models/user.model.js";
import Post from "../models/post.model.js";
import { ObjectId, Schema, Types } from "mongoose";

const createPost = async (req: customRequest, res: Response) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text)
      return res
        .status(400)
        .json({ message: "PostedBy and text firlds are required" });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user?._id.toString() !== user?._id.toString())
      return res.status(401).json({ message: "UnAuthorized to create a Post" });

    const maxLength = 500;

    if (text.length > maxLength)
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error will creating post" });
  }
};

const getPost = async (req: customRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(401).json({ message: "Post not found" });

    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error will Fetching Post" });
  }
};

const deletePost = async (req: customRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.user?._id.toString())
      return res.status(401).json({ message: "Unauthorized to delete post" });

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error will Deleting Post" });
  }
};

const likeUnlikePost = async (req: customRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user?._id;
    // console.log(typeof userId);
    if (!post) return res.status(404).send({ message: "Post not Found" });

    if (!userId) return res.status(404).send({ message: "userId not Found" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like Post
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error will Liking/Unliking the Post" });
  }
};

const replyToPost = async (req: customRequest, res: Response) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user?._id;
    const userProfilePic = req.user?.profilePic;
    const username = req.user?.username;

    if (!text)
      return res.status(404).json({ message: "Text field is required" });

    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Text field is required" });

    const reply = { userId, text, userProfilePic, username };

    await Post.updateOne({ _id: postId }, { $push: { replies: reply } });
    res.status(200).json({ message: "Reply added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while replting to a Post" });
  }
};

const getFeedPosts = async (req: customRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json({ feedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while replting to a Post" });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
};
