// src/config/db.js
import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing in .env");

  // Optional but very helpful: connection lifecycle logs. [web:285]
  mongoose.connection.on("connected", () => console.log("✅ Mongoose: connected"));
  mongoose.connection.on("open", () => console.log("✅ Mongoose: connection open"));
  mongoose.connection.on("error", (err) => console.log("❌ Mongoose error:", err.message));
  mongoose.connection.on("disconnected", () => console.log("⚠️ Mongoose: disconnected"));

  await mongoose.connect(uri); // resolves when initial connection succeeds. [web:285]
}
