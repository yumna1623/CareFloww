import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { patientOnly, doctorOnly } from "../middlewares/role.middleware.js";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorQueue,
  cancelAppointment,
  startConsultation,
  completeConsultation,
} from "../controllers/appointment.controller.js";

import { markMissed } from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/book", authMiddleware, patientOnly, bookAppointment);

router.get("/my", authMiddleware, patientOnly, getMyAppointments);
router.get("/queue", authMiddleware, doctorOnly, getDoctorQueue);
router.delete("/:id", authMiddleware, patientOnly, cancelAppointment);

router.patch("/start/:id", authMiddleware, doctorOnly, startConsultation);
router.patch("/complete/:id", authMiddleware, doctorOnly, completeConsultation);
router.patch("/missed/:id", authMiddleware, doctorOnly, markMissed);

export default router;
