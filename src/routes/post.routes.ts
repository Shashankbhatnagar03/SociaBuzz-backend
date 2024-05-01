import { Router } from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  likeUnlikePost,
  replyToPost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.get("/feed", verifyJWT, getFeedPosts);
router.get("/:id", getPost);
router.post("/create", verifyJWT, createPost);
router.delete("/:id", verifyJWT, deletePost);
router.put("/like/:id", verifyJWT, likeUnlikePost);
router.put("/reply/:id", verifyJWT, replyToPost);

export default router;
