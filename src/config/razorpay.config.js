import razorpay from "razorpay";

const razorpayInstance = new razorpay({
  key_id: process.env.PAYMENT_GATEWAY_API_KEY,
  key_secret: process.env.PAYMENT_GATEWAY_API_SECRET,
});
export default razorpayInstance;