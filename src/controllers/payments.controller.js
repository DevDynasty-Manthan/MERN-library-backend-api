import Payments from "../models/Payment.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";

export const registerOnlinePayment = async (req, res) => {
  try {
    const { amount, transactionId, method } = req.body;

    if (!amount || !transactionId || !method) {
      return res.status(400).json({ ok: false, msg: "Fill the required fields" });
    }

    if (method !== "online") {
      return res.status(400).json({ ok: false, msg: "Only UPI allowed here" });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, msg: "Screenshot is required" });
    }

    const uploaded = await uploadOnCloudinary(req.file.path);
    if (!uploaded?.secure_url) {
      return res.status(500).json({ ok: false, msg: "Upload failed" });
    }

    const payment = await Payments.create({
      userId: req.user.id,
      amount: Number(amount),
      transactionId,
      screenshotUrl: uploaded.secure_url,
      method: method,
      status: "pending",
    });

    return res.status(201).json({ ok: true, data: payment });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err?.message || "Internal server error" });
  }
};

// import Payments from "../models/Payment.js";

export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentData = await Payments.find({ userId })
      .populate("userId", "name email role"); // optional

    if (paymentData.length === 0) {
      return res.status(404).json({ ok: false, message: "No payments found" });
    }

    return res.status(200).json({ ok: true, data: paymentData });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err?.message || "Internal server error" });
  }
};

export const getAllPayments = async (req,res)=>{
    const userId = req.user.id;
    
}