import Student from "../models/Student.js";
import User from "../models/User.js";
import Plan from "../models/plan.js";

export const uploadAdmissionInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const admissionData = req.body;
    let updateData = { ...admissionData, userId };

    // If a plan is selected, fetch plan data and save reference
    if (admissionData.planCode) {
      const plan = await Plan.findOne({ code: admissionData.planCode });

      if (!plan) {
        return res
          .status(404)
          .json({ ok: false, message: `Plan '${admissionData.planCode}' not found` });
      }

      // Save only plan ID and code as reference
      updateData = {
        ...updateData,
        plan: plan._id,
        planCode: plan.code,
      };
    }

    const studentProfile = await Student.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).populate("plan userId");

    return res.status(201).json({
      ok: true,
      message: "Admission info saved",
      data: studentProfile,
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
    const role = req.user.role;
    const userId = req.user.id;
    if (role !== "admin") {
      return res.status(403).json({
        ok: false,
        message: "you are not authorized to access the data",
      });
    }
    const students = await Student.find().populate("userId plan");
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
    const id = req.user.id;
    const student = await Student.findOne({ userId: id }).populate(
      "userId plan"
    );
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
