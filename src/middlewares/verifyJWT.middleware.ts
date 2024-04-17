import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { customRequest } from "../types/types.js";

const verifyJWT = async (
  req: customRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "Invalid Access token" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unauthorized" });
  }
};

export { verifyJWT };
