import { Router } from "express";
import authenticateJWT from "../middleware/auth.js";
import authorizeRoles  from "../middleware/adminAuth.js"
import {
  uploadAdmissionInfo,
  getStudentById,
  getAllStudents,
  updateMyPlan
} from "../controllers/students.controller.js";

const router = Router();

// admission data creation
router.post("/", authenticateJWT, uploadAdmissionInfo);

// list all students
router.get("/", authorizeRoles("admin"), getAllStudents);

// get one student by id
router.get("/me", authenticateJWT, getStudentById);
router.put("/me", authenticateJWT, uploadAdmissionInfo);
router.put("/me/plan", authenticateJWT, uploadAdmissionInfo);
// router.post('/payment', authenticateJWT,)
export default router;
