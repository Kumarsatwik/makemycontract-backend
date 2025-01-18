import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const dbURI = process.env.MONGODB_URI!;
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
