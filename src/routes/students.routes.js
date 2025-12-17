import { Router } from "express";
import authenticateJWT from "../middleware/auth.js";
import {
  uploadAdmissionInfo,
  getAllStudents,
  getStudentById,
} from "../controllers/students.controller.js";

const router = Router();

// admission data creation
router.post("/", authenticateJWT, uploadAdmissionInfo);

// list all students
router.get("/", authenticateJWT, getAllStudents);

// get one student by id
// router.get("/me", authenticateJWT, getStudentById);
router.put("/me", authenticateJWT, uploadAdmissionInfo);
export default router;
