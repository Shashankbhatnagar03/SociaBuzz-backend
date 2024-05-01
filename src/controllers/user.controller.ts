import { Request, Response } from "express";
import { customRequest } from "../types/types.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
//
const getUserProfile = async (req: customRequest, res: Response) => {
  // query can be either username or user ID
  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating user" });
  }
};

//SignUp User
const signupUser = async (req: customRequest, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "invalid user data" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating user" });
  }
};

//Login User
const loginUser = async (req: customRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ error: "Invalid Username" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid password" });

    generateTokenAndSetCookie(existingUser._id, res);

    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      username: existingUser.username,
      bio: existingUser.bio,
      profilePic: existingUser.profilePic,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating user" });
  }
};

//Logout user
const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating user" });
  }
};

//Follow a user or unfollow user
const followUnFollowUser = async (req: customRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    if (!userToModify) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await User.findById(req.user?._id);

    if (id == req.user?._id.toString())
      return res
        .status(400)
        .json({ error: "you cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ message: "User not found" });

    const isFollowing = currentUser?.following.includes(id);

    if (isFollowing) {
      //Unfollow User
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user?._id } });
      await User.findByIdAndUpdate(req.user?._id, { $pull: { following: id } });
      res.status(200).json({ message: "User Unfollowed successfully" });
    } else {
      //follow User
      await User.findByIdAndUpdate(id, { $push: { followers: req.user?._id } });
      await User.findByIdAndUpdate(req.user?._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error in follow or unfollow  user " });
  }
};
//update user
const updateUser = async (req: customRequest, res: Response) => {
  try {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user?._id;

    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId?.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        const publicId = user.profilePic.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    user.password = "";

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error in Update User " });
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
};
