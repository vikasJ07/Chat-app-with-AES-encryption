import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL;
    console.log("Mongo URI:", mongoUri);  // Add this line to check if MONGO_URI is loaded correctly
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

export default connectToMongoDB;
