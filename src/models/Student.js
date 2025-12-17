import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",          // link to User
      required: false,      // you can make it true later when flow is fixed
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    // add more admission fields as needed
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
