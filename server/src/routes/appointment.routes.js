import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import { patientOnly, doctorOnly } from "../middlewares/role.middleware.js";
import {
  bookAppointment,
  getMyAppointments,
  getDoctorQueue,
  cancelAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/book", authMiddleware, patientOnly, bookAppointment);

router.get("/my", authMiddleware, patientOnly, getMyAppointments);
router.get("/queue", authMiddleware, doctorOnly, getDoctorQueue);
router.delete("/:id", authMiddleware, patientOnly, cancelAppointment);

export default router;
