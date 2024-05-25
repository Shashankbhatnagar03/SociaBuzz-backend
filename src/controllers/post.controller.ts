import { Response } from "express";
import { customRequest } from "../types/types.js";
import { User } from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import {
  PostInput,
  PostSchema,
  ReplyInput,
  ReplySchema,
} from "../utils/validation/post.validation.js";

const createPost = async (req: customRequest, res: Response) => {
  try {
    const { success } = PostSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid Input Fields" });
    }
    const { postedBy, text }: PostInput = req.body;
    let { img }: PostInput = req.body;

    if (!postedBy)
      return res.status(400).json({ error: "PostedBy fields are required" });

    if (!text && !img)
      return res.status(400).json({ error: "Text or Image is required" });

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user?._id.toString() !== user?._id.toString())
      return res.status(401).json({ error: "UnAuthorized to create a Post" });

    const maxLength = 500;

    if (text && text.length > maxLength)
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error will creating post" });
  }
};

const getPost = async (req: customRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(401).json({ error: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error will Fetching Post" });
  }
};

const deletePost = async (req: customRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.postedBy.toString() !== req.user?._id.toString())
      return res.status(401).json({ error: "Unauthorized to delete post" });

    if (post.img) {
      const imgId = post.img.split("/").pop()?.split(".")[0];
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error will Deleting Post" });
  }
};

const likeUnlikePost = async (req: customRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user?._id;
    // console.log(typeof userId);
    if (!post) return res.status(404).send({ error: "Post not Found" });

    if (!userId) return res.status(404).send({ error: "userId not Found" });

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
    res.status(500).json({ error: "Error will Liking/Unliking the Post" });
  }
};

const replyToPost = async (req: customRequest, res: Response) => {
  try {
    const { success } = ReplySchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ error: "Invalid Input Fields" });
    }
    const { text }: ReplyInput = req.body;
    const postId = req.params.id;
    const userId = req.user?._id;
    const userProfilePic = req.user?.profilePic;
    const username = req.user?.username;

    if (!text) return res.status(404).json({ error: "Text field is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Text field is required" });

    const reply = { userId, text, userProfilePic, username };

    await Post.updateOne({ _id: postId }, { $push: { replies: reply } });
    res.status(200).json(reply);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while replting to a Post" });
  }
};

const getFeedPosts = async (req: customRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while replying to a Post" });
  }
};

const getUserPost = async (req: customRequest, res: Response) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    }); //sorted in descending order
    res.status(200).json(posts);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Error while fetching the user data" });
  }
};
export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPost,
};
