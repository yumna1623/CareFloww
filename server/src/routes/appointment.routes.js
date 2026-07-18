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
  rescheduleAppointment,
  getPatientDashboard,
  addPrescription,
  getPatientAppointments,
  trackAppointment,
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
router.patch(
  "/reschedule/:id",
  authMiddleware,
  patientOnly,
  rescheduleAppointment,
);
router.get(
  "/patient-dashboard",
  authMiddleware,
  patientOnly,
  getPatientDashboard,
);
router.patch("/prescription/:id", authMiddleware, doctorOnly, addPrescription);
router.get("/my-appointments", authMiddleware, getPatientAppointments);
router.patch("/:appointmentId/cancel", authMiddleware, cancelAppointment);
router.get("/track/:id", authMiddleware, patientOnly, trackAppointment);
export default router;
