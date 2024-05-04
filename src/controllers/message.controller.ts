import { Response } from "express";
import { customRequest } from "../types/types.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const sendMessage = async (req: customRequest, res: Response) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user?._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error will fetching message" });
  }
};

const getMessages = async (req: customRequest, res: Response) => {
  const { otherUserId } = req.params;
  const userId = req.user?._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await Message.find({
      conversationId: conversation?._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error will fetching conversation" });
  }
};

const getConversations = async (req: customRequest, res: Response) => {
  const userId = req.user?._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Error will fetching conversation" });
  }
};
export { sendMessage, getMessages, getConversations };
