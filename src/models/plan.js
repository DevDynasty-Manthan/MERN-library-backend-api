import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  code: {
    type: String,
    enum: ["Normal", "Premium"],
    required: true,
    unique: true,
  },
  fees: {
    type: Number,
    required: true,
    description: "Monthly or subscription fees for the plan",
  },
  features: {
    type: [String],
    required: true,
    description: "Array of features included in the plan",
  },
  capacity: {
    type: Number,
    default: 60,
    description: "Room capacity for the plan",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;