import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",          // link to User
      required: false,      // you can make it true later when flow is fixed
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    purpose :[
      {
        type: String,
        required: true,

      }
    ],
    age: {
      type: Number,
      required: true,
    },
    // add more admission fields as needed
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
