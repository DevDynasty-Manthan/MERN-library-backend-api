import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: [
      {
        type: String,
        required: true,
      },
    ],
    age: {
      type: Number,
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: false,
      description: "Reference to selected plan (Normal or Premium)",
    },
    planCode: {
      type: String,
      enum: ["Normal", "Premium"],
      required: false,
      description: "Plan code for quick reference",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
