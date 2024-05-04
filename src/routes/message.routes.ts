import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/conversations", verifyJWT, getConversations);
router.get("/:otherUserId", verifyJWT, getMessages);
router.post("/", verifyJWT, sendMessage);

export default router;
