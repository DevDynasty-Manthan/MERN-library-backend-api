import 'dotenv/config'
import app from './src/app.js'
import connectDB from "./src/config/db.js";
import razorpayInstance from './src/config/razorpay.config.js';
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5000;

async function startServer() {
    try{
        await razorpayInstance;
        // console.log(razorpayInstance)
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err){
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}
startServer();