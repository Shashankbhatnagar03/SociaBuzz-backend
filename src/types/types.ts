import { Types } from "mongoose";

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