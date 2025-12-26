import bcrypt from "bcrypt";
import User from "../models/User.js";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
// import app from './src/app.js'
import cookieparser from "cookie-parser";
export const registerUser = async (req, res) => {
  try {
    const { name,phone, email, password} = req.body;

    if (!email || !password || !phone) {
      return res
        .status(400)
        .json({ ok: false, message: "Email, phone and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds [web:385][web:476]

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role: "student",
    });
    
    return res.status(201).json({
      ok: true,
      message: "User registration successful",
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }
       console.log("user in login body 1", user.email);
    const isMatch = await bcrypt.compare(password, user.password); // [web:385]
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }
 
    const token = jwt.sign(
  { id: user._id, role: user.role, sessionId: user.sessionId, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);
       console.log("user in login body 2", user.email);
   
    console.log("Generated JWT Token:", token);
    // for now, no JWT — just send basic user info
    return res.json({
      ok: true,
      message: "User login successful",
      data : {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
