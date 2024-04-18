import mongoose, { Schema, Types } from "mongoose";
import { Ipost } from "../types/types.js";

const postSchema = new Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  text: {
    type: String,
    maxLength: 500,
  },
  img: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: [
    {
      userId: {
        type: Types.ObjectId,
        ref: "User",
        require: true,
      },
      text: {
        type: String,
        require: [true, "Please enter your reply"],
      },
      userProfilePic: {
        type: String,
      },
      username: {
        type: String,
      },
    },
  ],
});

const Post = mongoose.model<Ipost>("Post", postSchema);

export default Post;
