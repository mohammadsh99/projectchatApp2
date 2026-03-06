import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    //wa want to conect database
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB conection error::", error);
  }
};
