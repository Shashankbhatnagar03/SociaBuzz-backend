import mongoose, { Schema } from "mongoose";
import { Iuser } from "../types/types.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter your Full Name"],
    },
    username: {
      type: String,
      require: [true, "Please enter your Username"],
      unique: [true, "Username already exists!"],
    },
    email: {
      type: String,
      require: [true, "Please enter your Email"],
      unique: [true, "Email already exists!"],
    },
    password: {
      type: String,
      require: [true, "Please enter Password"],
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<Iuser>("User", userSchema);
