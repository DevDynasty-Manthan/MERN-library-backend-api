import express from "express";
import {
  step1_userRegistration,
  step2_admissionData,
  step3_selectPlan,
  step4_selectSeat,
  step5_createPaymentOrder,
  step5_verifyPayment,
  getSessionStatus,
  step5_creatOtpForCashPayment,
  step5_verifyOtp
} from "../controllers/onboarding.controller.js";
import authenticateJWT from "../middleware/auth.js";

const router = express.Router();

// Step 1: User Registration (No auth needed)
router.post("/step1/register", step1_userRegistration);

// Steps 2-5: Require authentication
router.post("/step2/admission", authenticateJWT, step2_admissionData);
router.post("/step3/plan", authenticateJWT, step3_selectPlan);
router.post("/step4/seat", authenticateJWT, step4_selectSeat);
router.post("/step5/create-order", authenticateJWT, step5_createPaymentOrder);
router.post("/step5/verify-payment", authenticateJWT, step5_verifyPayment);
router.get('/step5/create-otp', authenticateJWT, step5_creatOtpForCashPayment)
router.post('/step5/verify-otp',authenticateJWT,step5_verifyOtp)
router.get("/status", authenticateJWT, getSessionStatus);

export default router;
