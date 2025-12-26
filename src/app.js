import express from "express";
import healthRoutes from "./routes/health.routes.js";
import studentRoutes from "./routes/students.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payments.routes.js"
import seatRoutes from "./routes/seats.routes.js";
import onboardingRoutes from "./routes/onboarding.routes.js";
import planRoutes from "./routes/plans.routes.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
    origin: "http://localhost:5173", // Vite dev URL
    credentials: true,
  }
));

app.use("/api/health", healthRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use('/api/payments',paymentRoutes)
app.use('/api/seats',seatRoutes)
app.use('/api/plans',planRoutes)
app.use('/api/onboarding', onboardingRoutes)
export default app;
