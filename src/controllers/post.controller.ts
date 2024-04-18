import { Response } from "express";
import { customRequest } from "../types/types.js";
import { User } from "../models/user.model.js";
import Post from "../models/post.model.js";

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
export { createPost, getPost, deletePost };
