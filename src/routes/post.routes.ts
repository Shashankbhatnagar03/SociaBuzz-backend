import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.get("/:id", getPost);
router.post("/create", verifyJWT, createPost);
router.delete("/:id", verifyJWT, deletePost);

export default router;
