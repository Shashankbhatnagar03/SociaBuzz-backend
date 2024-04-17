import { ObjectId, Schema, Types } from "mongoose";

export interface Iuser {
    _id : Types.ObjectId;
    username: string;
    email: string;
    name:string;
    password: string;
    profilePic:string;
    followers:string;
    following:string;
    bio:string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Ipost {
    postedBy: ObjectId;
    text?: string; 
    img?: string; 
    likes: number;
    replies: IReply[];
  }
  
  export interface IReply {
    userId: ObjectId;
    text: string; 
    userProfilePic?: string;
    username?: string;
  }