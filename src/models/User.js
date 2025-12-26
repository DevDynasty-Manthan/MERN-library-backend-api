import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone:{
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // hide by default
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    sessionId : String 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
