import { Request } from "express";
import { ObjectId, Types } from "mongoose";

export interface Iuser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  name: string;
  password: string;
  profilePic: string;
  followers: string;
  following: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Ipost {
  postedBy: ObjectId;
  text?: string;
  img?: string;
  likes: ObjectId[];
  replies: IReply[];
}

export interface IReply {
  userId: ObjectId;
  text: string;
  userProfilePic?: string;
  username?: string;
}

export interface customRequest extends Request {
  user?: Iuser;
}
