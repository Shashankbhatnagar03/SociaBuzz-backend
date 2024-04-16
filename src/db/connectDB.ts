import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URL || "";
    const connectionInstance = await mongoose.connect(uri);
    console.log(`Mongo Db Connected   ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Unable To Connect To Db  : ", error);
    process.exit(1);
  }
};

export default connectDB;
