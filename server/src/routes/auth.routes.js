import express from "express";

import {
  patientSignup,
  doctorSignup,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { patientOnly } from "../middlewares/role.middleware.js";
import { getMyAppointments } from "../controllers/appointment.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/patient/signup", patientSignup);

router.post("/doctor/signup", doctorSignup);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);
router.get("/my", authMiddleware, patientOnly, getMyAppointments);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
