import { Router } from "express";
import {
  followUnFollowUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", verifyJWT, followUnFollowUser);

export default router;
