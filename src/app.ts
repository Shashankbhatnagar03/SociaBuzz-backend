import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
dotenv.config();
connectDB();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("server started at local host " + PORT));
setInterval(async () => {
  console.log(" calling ping ");
  try {
    const response = await fetch(process.env.PING_URL || "");
    const data = await response.text();
    console.log("response  ", data);
  } catch (e) {
    console.log("error in ping ", e);
  }
}, 840000);
