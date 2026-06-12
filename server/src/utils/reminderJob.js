import cron from "node-cron";
import prisma from "../config/prisma.js";
import { sendEmail } from "../utils/sendEmail.js";

export const startReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Checking reminders...");

      const now = new Date();

      const appointments = await prisma.appointment.findMany({
        where: {
          reminderSent: false,
          status: "pending",
        },
        include: {
          patient: true,
          doctor: true,
        },
      });

      for (let appt of appointments) {
        const appointmentTime = new Date(appt.appointmentDate);

        const [hour, minute] = appt.slotStartTime.split(":");
        appointmentTime.setHours(hour, minute, 0, 0);

        const diff = appointmentTime - now;

        // 1 hour = 3600000 ms
        if (diff > 0 && diff <= 3600000) {
          // ❗ PREVENT DUPLICATE EMAILS (VERY IMPORTANT)
          if (appt.reminderSent) continue;

          await sendEmail({
            to: appt.patient.email,
            subject: "Appointment Reminder (1 Hour Left)",
            text: `
Reminder!

Doctor: Dr. ${appt.doctor.name}
Appointment ID: ${appt.id}

Date: ${new Date(appt.appointmentDate).toDateString()}

Time: ${appt.slotStartTime} - ${appt.slotEndTime}

Your appointment begins in less than 1 hour.
            `,
          });

          // mark as sent
          await prisma.appointment.update({
            where: { id: appt.id },
            data: { reminderSent: true },
          });

          console.log("Reminder sent:", appt.id);
        }
      }
    } catch (error) {
      console.log("Reminder job error:", error.message);
    }
  });
};
