import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    education: {
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
    SeatNo:{
      type: Number,
      required:false
    },
    membershipStatus : {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
      description: "Status of the student's membership",
    }
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
