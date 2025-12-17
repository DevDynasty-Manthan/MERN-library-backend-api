import Student from "../models/Student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json({
      ok: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId"); // include minimal user info if linked ]
    return res.json({
      ok: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id).populate("userId"); // ]
    if (!student) {
      return res
        .status(404)
        .json({ ok: false, message: "Student not found" });
    }
    return res.json({ ok: true, data: student });
  } catch (error) {
    console.error("Error fetching student:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
