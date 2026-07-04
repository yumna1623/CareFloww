import cron from "node-cron";
import prisma from "../config/prisma.js";
import { sendEmail } from "../utils/sendEmail.js";

export const startReminderJob = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Checking reminders & missed appointments...");

      const now = new Date();

      // ===================================================
      // PART 1: Automatically mark expired appointments
      // ===================================================

      const pendingAppointments = await prisma.appointment.findMany({
        where: {
          status: "pending",
        },
      });

      for (const appointment of pendingAppointments) {
        const appointmentDateTime = new Date(appointment.appointmentDate);

        const [hour, minute] = appointment.slotStartTime
          .split(":")
          .map(Number);

        appointmentDateTime.setHours(hour, minute, 0, 0);

        // Appointment time has passed
        if (appointmentDateTime < now) {
          await prisma.appointment.update({
            where: {
              id: appointment.id,
            },
            data: {
              status: "missed",
            },
          });

          console.log(`Appointment ${appointment.id} marked as MISSED`);
        }
      }

      // ===================================================
      // PART 2: Send Reminder Emails
      // ===================================================

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

      for (const appt of appointments) {
        const appointmentTime = new Date(appt.appointmentDate);

        const [hour, minute] = appt.slotStartTime
          .split(":")
          .map(Number);

        appointmentTime.setHours(hour, minute, 0, 0);

        const diff = appointmentTime - now;

        // Send reminder only within 1 hour before appointment
        if (diff > 0 && diff <= 60 * 60 * 1000) {
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

          await prisma.appointment.update({
            where: {
              id: appt.id,
            },
            data: {
              reminderSent: true,
            },
          });

          console.log(`Reminder sent: ${appt.id}`);
        }
      }
    } catch (error) {
      console.log("Reminder Job Error:", error.message);
    }
  });
};