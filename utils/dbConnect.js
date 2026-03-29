import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

export default async function dbConnect() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // Connection options to prevent buffering timeout
    const options = {
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
      w: "majority",
    };

    await mongoose.connect(MONGO_URI, options);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    
    // Provide more specific error information
    if (err.message.includes("buffering")) {
      console.error("⚠️ Connection buffering timeout - Check MongoDB URI and network connectivity");
    }
    if (err.message.includes("ENOTFOUND")) {
      console.error("⚠️ DNS resolution failed - Check your MongoDB connection string");
    }
    
    throw new Error("Failed to connect to MongoDB: " + err.message);
  }
}
