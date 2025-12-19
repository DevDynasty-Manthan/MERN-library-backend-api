import express from "express";
import healthRoutes from "./routes/health.routes.js";
import studentRoutes from "./routes/students.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payments.routes.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use('/api/payments',paymentRoutes)
export default app;
