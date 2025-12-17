import Student from "../models/Student.js";
import User from "../models/User.js";

export const uploadAdmissionInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user =await User.findById(userId);
    
    if(!user){
      res.json({
        ok : 'false',
        msg : 'user not found in user'
      })
    }
    const addmissionData = req.body;
    const sutdentProfile = await Student.findOneAndUpdate(
      {userId},
      {$set :addmissionData,userId},
      {new : true,upsert:true,runValidators : true}
      )
   
    return res.status(201).json({
      ok: true,
      message: "Admission info saved",
      data: sutdentProfile,
    
    });
    
  } catch (error) {
    console.error("Error creating student:", error);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

// export const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find().populate("userId"); // include minimal user info if linked ]
//     return res.json({
//       ok: true,
//       data: students,
//     });
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     return res
//       .status(500)
//       .json({ ok: false, message: "Internal server error" });
//   }
// };

// export const getStudentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const student = await Student.findById(id).populate("userId"); // ]
//     if (!student) {
//       return res
//         .status(404)
//         .json({ ok: false, message: "Student not found" });
//     }
//     return res.json({ ok: true, data: student });
//   } catch (error) {
//     console.error("Error fetching student:", error);
//     return res
//       .status(500)
//       .json({ ok: false, message: "Internal server error" });
//   }
// };

// export const updateStudentById = async (req, res) => {
//   try {
//     const { id } = req.user.id;
//     const updatedData = req.body;