import { Request, Response } from "express";
import {
  ExistingUserRequest,
  NewUserRequest,
  customRequest,
} from "../types/types.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

//SignUp User
const signupUser = async (
  req: Request<{}, {}, NewUserRequest>,
  res: Response
) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
      generateTokenAndSetCookie({ userId: newUser._id }, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

//Login User
const loginUser = async (
  req: Request<{}, {}, ExistingUserRequest>,
  res: Response
) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Username" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });

    generateTokenAndSetCookie({ userId: existingUser._id }, res);

    res.status(200).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      username: existingUser.username,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

//Logout user
const logoutUser = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

//Follow a user or unfollow user
const followUnFollowUser = async (req: customRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    if (!userToModify) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user?._id);

    if (id == req.user?._id.toString())
      return res
        .status(400)
        .json({ message: "you cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ message: "User not found" });

    const isFollowing = currentUser?.following.includes(id);

    if (isFollowing) {
      //Unfollow User
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user?._id } });
      await User.findByIdAndUpdate(req.user?._id, { $pull: { following: id } });
    } else {
      //follow User
      await User.findByIdAndUpdate(id, { $push: { followers: req.user?._id } });
      await User.findByIdAndUpdate(req.user?._id, { $push: { following: id } });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in follow or unfollow  user " });
  }
};
export { signupUser, loginUser, logoutUser, followUnFollowUser };
