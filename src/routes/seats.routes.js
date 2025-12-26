import { Router } from "express";
import {
  getAvailableSeats,
  requestSeat
} from "../controllers/seats.controller.js";
import authenticateJWT from "../middleware/auth.js";
import authorizeRoles from "../middleware/adminAuth.js";

const router = Router();

// Get available seats for a plan (Student & Admin)
router.get("/available", authenticateJWT, getAvailableSeats);

// Get seat statistics for all plans (Admin only)
// router.get("/statistics", authenticateJWT, authorizeRoles("admin"), getSeatStatistics);

// Get all seat assignments for a plan (Admin only)
// router.get("/plan", authenticateJWT, authorizeRoles("admin"), getPlanSeats);

// Assign a seat to student
router.post("/assign", authenticateJWT, requestSeat);

// Get my seat assignment (Student)
// router.get("/me", authenticateJWT, getMySeatAssignment);

export default router;