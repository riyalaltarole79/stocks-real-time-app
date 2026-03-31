import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI not found in .env");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }

  return cached.conn;
};