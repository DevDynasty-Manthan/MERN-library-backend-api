import RegistrationSession from "../models/RegistrationSession.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Payment from "../models/Payment.js";
import seatAssignment from "../models/seatAssignment.js";
import Plan from "../models/plan.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import razorpayInstance from "../config/razorpay.config.js";

// Step 1: User Registration
export const step1_userRegistration = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;
    if (!email || !name || !phone || !password) {
      return res.status(400).json({ ok: false, msg: "Fill all required fields" });
    }

    // 1) find user
    let user = await User.findOne({ email });

    // 2) create session FIRST (always)
    let session = await RegistrationSession.findOne({ email, isCompleted: false });
    if (!session) {
      session = await RegistrationSession.create({
        email,
        currentStep: 1,
        isCompleted: false,
        step1: { completed: false },
      });
    }

    // 3) create user if not exists (or update if exists)
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
      user = await User.create({
        name,
        phone,
        email,
        password: hashedPassword,
        role: "student",
        sessionId: session._id,
        onboardingCompleted: false,
      });
    } else {
      // IMPORTANT: keep session link updated
      user.sessionId = session._id;
      await user.save();
    }

    // 4) update session step1
    session.userId = user._id;
    session.step1 = { name, phone, completed: true };
    session.currentStep = 2;
    await session.save();

    // 5) token must include sessionId (and email if you still query by email)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, sessionId: session._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      ok: true,
      msg: "Step 1 completed. Proceed to admission data.",
      data: { userId: user._id, sessionId: session._id, currentStep: 2, token },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err?.message || "Internal server error" });
  }
};



// Step 2: Admission Data
export const step2_admissionData = async (req, res) => {
  try {
    const { education, purpose, age } = req.body;
    const sessionId = req.user.sessionId;
    // From auth middleware
    
    if (!education || !purpose || !age) {
      return res
      .status(400)
      .json({ ok: false, msg: "Fill all required fields" });
    }
    
    const session = await RegistrationSession.findById(sessionId);
    // const session = await RegistrationSession.findOne({ email });
    if (!session || !session.step1.completed) {
      return res.status(400).json({
        ok: false,
        msg: "Complete step 1 first (user registration)",
      });
    }

    session.step2 = {
      education,
      purpose: Array.isArray(purpose) ? purpose : [purpose],
      age: Number(age),
      completed: true,
    };
    session.currentStep = 3;

    await session.save();

    return res.status(200).json({
      ok: true,
      msg: "Step 2 completed. Select a plan.",
      sessionId: session._id,
      currentStep: session.currentStep,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, msg: err?.message || "Internal server error" });
  }
};

// Step 3: Select Plan
export const step3_selectPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const email = req.user.email; // From auth middleware
const sessionId = req.user.sessionId;

if (!planId) {
  return res
  .status(400)
  .json({ ok: false, msg: "planId required" });
}

// Verify plan exists
const plan = await Plan.findById(planId);
if (!plan) {
  return res.status(404).json({ ok: false, msg: "Plan not found" });
}

const session = await RegistrationSession.findById(sessionId);
    // const session = await RegistrationSession.findOne({ email });
    if (!session || !session.step2.completed) {
      return res.status(400).json({
        ok: false,
        msg: "Complete step 2 first (admission data)",
      });
    }

    session.step3 = {
      planId,
      completed: true,
    };
    session.currentStep = 4;

    await session.save();

    return res.status(200).json({
      ok: true,
      msg: "Step 3 completed. Select a seat.",
      sessionId: session._id,
      currentStep: session.currentStep,
      plan: {
        code: plan.code,
        fees: plan.fees,
        capacity: plan.capacity,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, msg: err?.message || "Internal server error" });
  }
};

// Step 4: Select Seat
export const step4_selectSeat = async (req, res) => {
  try {
    
    const { seatNo } = req.body;
    const email = req.user.email; // From auth middleware
const sessionId = req.user.sessionId;

if (!seatNo) {
  return res
  .status(400)
  .json({ ok: false, msg: "seatNo required" });
}

const session = await RegistrationSession.findById(sessionId);
    // const session = await RegistrationSession.findOne({ email });
    if (!session || !session.step3.completed) {
      return res.status(400).json({
        ok: false,
        msg: "Complete step 3 first (select plan)",
      });
    }

    // Check if seat is already taken for this plan
    const existingSeat = await seatAssignment.findOne({
      planId: session.step3.planId,
      seatNo,
      status: { $in: ["assigned", "pending"] },
    });

    if (existingSeat) {
      return res.status(409).json({
        ok: false,
        msg: "This seat is already taken. Choose another.",
      });
    }

    session.step4 = {
      seatNo: Number(seatNo),
      completed: true,
    };
    session.currentStep = 5;

    await session.save();

    return res.status(200).json({
      ok: true,
      msg: "Step 4 completed. Proceed to payment.",
      sessionId: session._id,
      currentStep: session.currentStep,
      seatNo: Number(seatNo),
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, msg: err?.message || "Internal server error" });
  }
};

// Step 5: Create Payment Order
export const step5_createPaymentOrder = async (req, res) => {
  try {
    const email = req.user.email; // From auth middleware
const sessionId = req.user.sessionId;
const session = await RegistrationSession.findById(sessionId);

    if (!session || !session.step4.completed) {
      return res.status(400).json({
        ok: false,
        msg: "Complete step 4 first (select seat)",
      });
    }

    // Get plan details for amount
    const plan = await Plan.findById(session.step3.planId);
    const amount = plan.fees * 100; // Convert to paise

    // Create Razorpay order
    const options = {
      amount: Math.round(amount),
      currency: "INR",
      receipt: `sess_${session._id}`,
      notes: {
        sessionId: String(session._id),
        planId: String(plan._id),
        seatNo: String(session.step4?.seatNo || ""),
        email,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({
        ok: false,
        msg: "Failed to create payment order",
      });
    }

    // Store order details in session
    session.step5 = {
      ...session.step5,
      orderId: order.id,
      amount: plan.fees,
      completed: false, // Will be true after verification
    };

    await session.save();

   return res.status(200).json({
      ok: true,
      msg: "Payment order created",
      data: {
        orderId: order.id,
        amount: Math.round(plan.fees * 100), // send paise to frontend for checkout options
        currency: "INR",
        planCode: plan.code,
        sessionId: session._id,
        keyId: process.env.RAZORPAY_KEY_ID, // make sure this is key_id
      },
    });
  } catch (err) {
      console.error("step5_createPaymentOrder FULL ERROR:", err);
  console.error("message:", err?.message);
  console.error("stack:", err?.stack);
  // Razorpay SDK often gives useful fields:
  console.error("razorpay statusCode:", err?.statusCode);
  console.error("razorpay error:", err?.error);

  return res.status(500).json({
    ok: false,
    msg: err?.message || "Internal server error",
    // TEMP only (dev):
    details: err?.error || null,
  });
  }
};

// Step 5: Verify Payment & Complete Registration
export const step5_verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const sessionId = req.user.sessionId;
    const email = req.user.email;
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ ok: false, msg: "Fill all required fields" });
    }

    const secret = process.env.PAYMENT_GATEWAY_API_SECRET;
    const hmac = crypto.createHmac("sha256", secret).update(orderId + "|" + paymentId).digest("hex");
    if (hmac !== signature) {
      return res.status(400).json({ ok: false, msg: "Payment verification failed - Invalid signature" });
    }

    const session = await RegistrationSession.findById(sessionId);
    if (!session) return res.status(404).json({ ok: false, msg: "Session not found" });

    // Ensure order belongs to this session (important)
    if (session.step5?.orderId !== orderId) {
      return res.status(400).json({ ok: false, msg: "OrderId mismatch" });
    }

    const user = await User.findOne({email});
    if (!user) return res.status(404).json({ ok: false, msg: "User not found" });

    user.onboardingCompleted = true;
    await user.save(); // persist changes [web:1051]

    const payment = await Payment.create({
      userId: user._id,
      planId: session.step3.planId,
      amount: session.step5.amount,
      transactionId: paymentId,
      orderId,
      method: "online",
      status: "verified",
    });

    const student = await Student.create({
      userId: user._id,
      education: session.step2.education,
      purpose: session.step2.purpose,
      age: session.step2.age,
      plan: session.step3.planId,
      SeatNo: session.step4.seatNo,
      membershipStatus: "active",
    });

    await seatAssignment.create({
      userId: user._id,
      planId: session.step3.planId,
      seatNo: session.step4.seatNo,
      status: "assigned",
      startsAt: new Date(),
    });

    session.step5.completed = true;
    session.isCompleted = true;
    session.studentId = student._id;
    session.currentStep = 5;
    await session.save();

    return res.status(201).json({
      ok: true,
      msg: "Registration completed successfully!",
      data: { userId: user._id, studentId: student._id },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err?.message || "Internal server error" });
  }
};


// Get Current Session Status
export const getSessionStatus = async (req, res) => {
  try {
    const email = req.user.email; // From auth middleware
    const sessionId = req.user.sessionId
    console.log(sessionId)
  const session = await RegistrationSession.findById(sessionId);


    if (!session) {
      return res.status(404).json({
        ok: false,
        msg: "No active session found",
      });
    }

    return res.status(200).json({
      ok: true,
      data: {
        currentStep: session.currentStep,
        isCompleted: session.isCompleted,
        completedSteps: {
          step1: session.step1?.completed,
          step2: session.step2?.completed,
          step3: session.step3?.completed,
          step4: session.step4?.completed,
          step5: session.step5?.completed,
        },
        sessionData: {
          name: session.step1?.name || null,
          email: session.email,
          education: session.step2?.education || null,
          age: session.step2?.age || null,
          purpose: session.step2?.purpose || null,
          plan: session.step3?.planId || null,
          seatNo: session.step4?.seatNo || null,
          paymentStatus: session.step5?.completed || false,
        },
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, msg: err?.message || "Internal server error" });
  }
};
