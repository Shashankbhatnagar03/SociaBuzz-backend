import { Router } from "express";
import {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  searchUser,
  signupUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.get("/profile/:query", getUserProfile);
router.get("/profiles/bulk", searchUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", verifyJWT, followUnFollowUser);
router.put("/update/:id", verifyJWT, updateUser);

export default router;
