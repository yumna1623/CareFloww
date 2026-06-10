import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import { patientOnly } from "../middlewares/role.middleware.js";

import { addReview } from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", authMiddleware, patientOnly, addReview);

export default router;
