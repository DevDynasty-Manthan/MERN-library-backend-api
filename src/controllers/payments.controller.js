import Payments from "../models/Payment.js";
import crypto from "crypto";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import Plan from "../models/plan.js";
import razorpayInstance from "../config/razorpay.config.js";
export const registerOnlinePayment = async (req, res) => {
  try {
    const { amount, planId, method } = req.body;

    if (!amount || !planId || !method) {
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

    const transactionId = crypto.randomBytes(16).toString('hex');

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

export const createOrder  =  async (req,res)=>{
  try{
     const {method,planId} = req.body;
      if( !method || !planId){
        return res.status(400).json({ ok: false, msg: "Fill the required fields" });
      }
      const plan = await Plan.findById(planId);
      if(!plan){
        return res.status(404).json({ ok: false, msg: "Plan not found" });
      }
      const amount = plan.fees * 100; // in paise
      const currency = "INR";
      //create order using razorpay instance
      const options = {
        amount,
        currency,
        receipt: `receipt_order_${Date.now()}`,//unique id
      };
      const order = await razorpayInstance.orders.create(options);  
      if(!order){
        return res.status(500).json({ ok: false, msg: "Order creation failed" });
      }
      return res.status(201).json({ ok: true, data: order });
  }
  catch(err){
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
}

export const verifyPayment = async (req,res)=>{
  try{
      const {oderId,paymentId,signature} = req.body;
      if(!oderId || !paymentId || !signature){
        return res.status(400).json({ ok: false, msg: "Fill all the fields" });
      }
      const secret = process.env.PAYMENT_GATEWAY_API_SECRET;
      //create hmac object
      const hmac = crypto.createHmac("sha256",secret);
    //update hmac object
    //what is hmac object ? : use to genrate hash value using cryptographic hash function
    //hmac object is updated with the data to be hashed
      hmac.update(oderId + "|" + paymentId);
      //what is signature ? : digital signature is used to verify the authenticity and integrity of a message or data 
      //generate signature
      const generatedSignature = hmac.digest("hex");

      if(generatedSignature !== signature){
        return res.status(400).json({ ok: false, msg: "Invalid signature, payment not verified" });
      }
      if(generatedSignature === signature){
        console.log("Payment verified successfully");
        return res.status(200).json({ ok: true, msg: "Payment verified successfully" });
      }
  }
  catch(err){
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
  }); return res.status(500).json({ ok: false, msg: err?.message || "Internal server error" });
  }
}