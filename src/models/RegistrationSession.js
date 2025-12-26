import mongoose from "mongoose";

const registrationSessionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    // Step 1: User Registration
    step1: {
      name: String,
      phone: String,
      password: String, // hashed
      completed: {
        type: Boolean,
        default: false,
      },
    },
    // Step 2: Admission Data
    step2: {
      education: String,
      purpose: [String],
      age: Number,
      completed: {
        type: Boolean,
        default: false,
      },
    },
    // Step 3: Select Plan
    step3: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    // Step 4: Seat Number
    step4: {
      seatNo: Number,
      completed: {
        type: Boolean,
        default: false,
      },
    },
    // Step 5: Payment
    step5: {
      paymentId: String,
      orderId: String,
      amount: Number,
      transactionId: String,
      method: {
        type: String,
        enum: ["cash", "upi", "online"],
      },
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    // Overall status
    currentStep: {
      type: Number,
      default: 1,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false 
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
  },
  { timestamps: true, expiresIn: 3600 } // Expires in 1 hour if not completed
);

// Auto-delete after 24 hours if not completed
registrationSessionSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { isCompleted: false },
  }
);

const RegistrationSession = mongoose.model(
  "RegistrationSession",
  registrationSessionSchema
);
export default RegistrationSession;
