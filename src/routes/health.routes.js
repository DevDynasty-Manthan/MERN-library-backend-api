import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    ok: true,
    dbState: mongoose.connection.readyState // 0/1/2/3 [web:297]
  });
});

export default router;
