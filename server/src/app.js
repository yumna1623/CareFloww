import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import { startReminderJob } from "./utils/reminderJob.js";
import appointmentRoutes from "./routes/appointment.routes.js";



const app = express();
app.use(helmet()); //👉 Protects from:
// XSS attacks
// clickjacking
// MIME sniffing
app.use(cors());
startReminderJob();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests, please try again later.",
});

app.use(limiter);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/reviews", reviewRoutes);

export default app;
