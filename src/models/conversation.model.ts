import mongoose, { Schema } from "mongoose";
import { IConversation } from "../types/types.js";

const conversationSchema = new Schema(
  {
    newConversation: {
      type: Boolean,
      default: false,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
