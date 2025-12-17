import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
} from "../controllers/students.controller.js";

const router = Router();

// admission data creation
router.post("/", createStudent);

// list all students
router.get("/", getAllStudents);

// get one student by id
router.get("/me", getStudentById);
router.put("/me", getStudentById);

export default router;
