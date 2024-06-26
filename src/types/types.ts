import { Request } from "express";
import { ObjectId, Schema, Types } from "mongoose";

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
  isFrozen: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Ipost {
  postedBy: Schema.Types.ObjectId;
  text?: string;
  img?: string;
  likes: [Types.ObjectId];
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
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

export interface IMessage {
  conversationId: string;
  sender: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  seen: boolean;
  img: string;
}

export interface IConversation {
  newConversation: boolean;
  participants: Types.ObjectId[];
  lastMessage: {
    text: string;
    sender: ObjectId;
    seen: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
