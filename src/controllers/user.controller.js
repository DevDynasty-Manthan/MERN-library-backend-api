import bcrypt from "bcrypt";
import User from "../models/User.js";
import Student from "../models/Student.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, enrollmentNo } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Email and password are required" });
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
      email,
      password: hashedPassword,
      role: "student",
    });

    // optional: auto-link to existing admission record by email or enrollmentNo
    if (enrollmentNo) {
      const admissionStudent = await Student.findOne({ enrollmentNo });
      if (admissionStudent) {
        admissionStudent.userId = user._id;
        await admissionStudent.save();
      }
    }

    return res.status(201).json({
      ok: true,
      message: "User registration successful",
      data: {
        id: user._id,
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

    const isMatch = await bcrypt.compare(password, user.password); // [web:385]
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid credentials" });
    }

    // for now, no JWT — just send basic user info
    return res.json({
      ok: true,
      message: "User login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
