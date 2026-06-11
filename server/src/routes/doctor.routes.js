import express from "express";

import {
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  updateProfile,
  getAvailableSlots,
  getDoctorDashboard,
  addLeaveDate,
  uploadProfileImage,
} from "../controllers/doctor.controller.js";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { doctorOnly } from "../middlewares/role.middleware.js";
import { getDoctorQueue } from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/dashboard", authMiddleware, doctorOnly, getDoctorDashboard);
router.get("/profile/me", authMiddleware, doctorOnly, getMyProfile);
router.patch("/profile", authMiddleware, doctorOnly, updateProfile);

router.get("/queue", authMiddleware, doctorOnly, getDoctorQueue);
router.get("/:id/slots", getAvailableSlots);
router.get("/:id/slots/:date", getAvailableSlots);
router.get("/:id", getDoctorById);

router.post("/leave", authMiddleware, doctorOnly, addLeaveDate);

router.post("/profile/upload",authMiddleware,doctorOnly,upload.single("image"),uploadProfileImage,);

export default router;
