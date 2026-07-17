import prisma from "../config/prisma.js";
import { calculateSlot } from "../utils/timeHelpers.js";
import { generateSlots } from "../utils/generateSlots.js";
import { sendNotification } from "../utils/notify.js";
import { getIO } from "../socket.js";
import { sendEmail } from "../utils/sendEmail.js";
import { updateQueue } from "../utils/updateQueue.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotStartTime, appointmentDate } = req.body;
    const patientId = req.user.id;

    // 1. Get doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 2. Normalize dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(appointmentDate);
    selectedDate.setHours(0, 0, 0, 0);

    // 3. Past date check
    if (selectedDate < today) {
      return res.status(400).json({ message: "Cannot book past dates" });
    }

    // 4. 7-day limit
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    if (selectedDate > maxDate) {
      return res.status(400).json({ message: "Can only book within 7 days" });
    }

    // 5. Doctor leave check (better match)
    const leaves = await prisma.doctorLeave.findMany({
      where: { doctorId },
    });

    const isOnLeave = leaves.some(
      (leave) =>
        new Date(leave.leaveDate).toDateString() ===
        selectedDate.toDateString(),
    );

    if (isOnLeave) {
      return res.status(400).json({
        message: "Doctor is unavailable on this date",
      });
    }

    // 6. Generate slots
    const allSlots = generateSlots(
      doctor.availableStartTime,
      doctor.availableEndTime,
      doctor.consultationDuration,
    );

    const selectedSlot = allSlots.find((slot) => slot.start === slotStartTime);

    if (!selectedSlot) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    // 7. Past time validation (same day)
    const now = new Date();

    if (selectedDate.toDateString() === now.toDateString()) {
      const [hour, minute] = slotStartTime.split(":").map(Number);

      const slotDate = new Date();
      slotDate.setHours(hour, minute, 0, 0);

      if (slotDate < now) {
        return res.status(400).json({
          message: "Cannot book past time slot",
        });
      }
    }

    // 8. Check existing appointment
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: selectedDate,
        slotStartTime,
        status: { not: "cancelled" },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // 9. Queue position
    const previousAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: selectedDate,
        status: {
          not: "cancelled",
        },
      },
    });

    const queuePosition = previousAppointments + 1;
    // 11. Get patient for email/notification
   const patient = await prisma.user.findUnique({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    if (!patient?.email) {
      return res.status(400).json({ message: "Patient email not found" });
    }

    // 10. Create appointment (queuePosition set temporarily, will be corrected below)
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: selectedDate,
        queuePosition: 0, // placeholder — recalculated right after
        slotStartTime,
        slotEndTime: selectedSlot.end,
        estimatedWait: null,
      },
    });

    // 11. Recalculate queue positions for the whole day, ordered by slot time
    await updateQueue(doctorId, selectedDate);

    // 12. Re-fetch the appointment so the response has the correct queuePosition
    const finalAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
    });

    await sendEmail({
      to: patient.email,
      subject: "Appointment Confirmed",
      text: `
Your appointment has been confirmed.

Doctor: Dr. ${doctor.name}
Appointment ID: ${finalAppointment.id}
Date: ${new Date(finalAppointment.appointmentDate).toDateString()}
Time: ${finalAppointment.slotStartTime} - ${finalAppointment.slotEndTime}

Please arrive 10 minutes early.

Thank you.
`,
    });

    sendNotification(doctorId, "new_appointment", {
      message: "New appointment booked",
      appointment: finalAppointment,
    });

    sendNotification(patientId, "appointment_confirmed", {
      message: "Your appointment is confirmed",
      appointment: finalAppointment,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointmentId: finalAppointment.id, // ← for tracking, as you asked
      appointment: finalAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const trackAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const doctor = appointment.doctor;

    // Appointment date + slot time
    const appointmentTime = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime
      .split(":")
      .map(Number);

    appointmentTime.setHours(hour, minute, 0, 0);

    const now = new Date();

    let currentQueue = 0;
    let peopleAhead = 0;
    let estimatedWait = 0;
    let countdown = null;

    // Future appointment
    if (now < appointmentTime) {
      const diff = appointmentTime.getTime() - now.getTime();

      const totalMinutes = Math.floor(diff / 60000);

      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor(
        (totalMinutes % (60 * 24)) / 60
      );
      const minutes = totalMinutes % 60;

      countdown = {
        days,
        hours,
        minutes,
      };
    } else {
      // Doctor has started consulting

      currentQueue = await prisma.appointment.count({
        where: {
          doctorId: appointment.doctorId,
          appointmentDate: appointment.appointmentDate,
          status: {
            in: ["done", "in-progress"],
          },
        },
      });

      peopleAhead = Math.max(
        appointment.queuePosition - currentQueue - 1,
        0
      );

      estimatedWait =
        peopleAhead * doctor.consultationDuration;
    }

    res.json({
      appointment,
      currentQueue,
      peopleAhead,
      estimatedWait,
      countdown,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyAppointments = async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: req.user.id,
    },
    include: {
      doctor: true,
    },
    orderBy: {
      appointmentDate: "asc",
    },
  });

  res.json(appointments);
};

export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialization: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        appointmentDate: "desc",
      },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorQueue = async (req, res) => {
    try {

        const doctorId = req.user.id;

        const date = req.query.date;

        let startDate;
        let endDate;

        if (date) {

            startDate = new Date(date);
            startDate.setHours(0,0,0,0);

            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate()+1);

        } else {

            startDate = new Date();
            startDate.setHours(0,0,0,0);

            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate()+1);

        }

        const appointments = await prisma.appointment.findMany({

            where:{
                doctorId,

                appointmentDate:{
                    gte:startDate,
                    lt:endDate
                },

                status:{
                    in:["pending","in-progress"]
                }
            },

            include:{
                patient:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            },

            orderBy:[
                {
                    appointmentDate:"asc"
                },
                {
                    slotStartTime:"asc"
                }
            ]

        });

        res.json(appointments);

    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    sendNotification(appointment.doctorId, "appointment_cancelled", {
      message: "Appointment cancelled",
    });

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    await updateQueue(appointment.doctorId, appointment.appointmentDate);

    getIO().emit("queueUpdated", {
      doctorId: appointment.doctorId,
    });

    res.json({
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const startConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment first
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        message: `Appointment is already ${appointment.status}`,
      });
    }

    // Appointment date + slot time
    const appointmentStart = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime
      .split(":")
      .map(Number);

    appointmentStart.setHours(hour, minute, 0, 0);

    if (new Date() < appointmentStart) {
      return res.status(400).json({
        message:
          "Consultation cannot start before the appointment time.",
      });
    }

    const updatedAppointment =
      await prisma.appointment.update({
        where: {
          id,
        },
        data: {
          status: "in-progress",
        },
      });

    getIO().emit("queueUpdated", {
      doctorId: updatedAppointment.doctorId,
    });

    sendNotification(
      updatedAppointment.patientId,
      "consultation_started",
      {
        message: "Your consultation has started",
      }
    );

    res.json({
      message: "Consultation started",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const completeConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment first
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "in-progress") {
      return res.status(400).json({
        message: "Consultation has not started",
      });
    }

    const updatedAppointment =
      await prisma.appointment.update({
        where: {
          id,
        },
        data: {
          status: "done",
        },
      });

    await updateQueue(
      updatedAppointment.doctorId,
      updatedAppointment.appointmentDate
    );

    getIO().emit("queueUpdated", {
      doctorId: updatedAppointment.doctorId,
    });

    sendNotification(
      updatedAppointment.patientId,
      "consultation_completed",
      {
        message: "Consultation completed",
      }
    );

    res.json({
      message: "Consultation completed",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { appointmentDate, slotStartTime } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },

      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const selectedDate = new Date(appointmentDate);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,

        appointmentDate: selectedDate,

        slotStartTime,

        status: {
          not: "cancelled",
        },

        NOT: {
          id,
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    const allSlots = generateSlots(
      appointment.doctor.availableStartTime,

      appointment.doctor.availableEndTime,

      appointment.doctor.consultationDuration,
    );

    const selectedSlot = allSlots.find((slot) => slot.start === slotStartTime);

    if (!selectedSlot) {
      return res.status(400).json({
        message: "Invalid slot",
      });
    }

    await prisma.appointment.update({
      where: { id },

      data: {
        appointmentDate: selectedDate,

        slotStartTime,

        slotEndTime: selectedSlot.end,
      },
    });

    res.json({
      message: "Appointment rescheduled",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user.id;

    const upcomingAppointments = await prisma.appointment.count({
      where: {
        patientId,
        status: "pending",
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        patientId,
        status: "done",
      },
    });

    const missedAppointments = await prisma.appointment.count({
      where: {
        patientId,
        status: "missed",
      },
    });

    const cancelledAppointments = await prisma.appointment.count({
      where: {
        patientId,
        status: "cancelled",
      },
    });

    // 👇 Fetch appointment details
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialization: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    res.json({
      upcomingAppointments,
      completedAppointments,
      missedAppointments,
      cancelledAppointments,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const addPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const { diagnosis, prescription } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }
    if (appointment.status !== "done") {
      return res.status(400).json({
        message: "Consultation not completed yet",
      });
    }

    if (appointment.doctorId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id,
      },

      data: {
        diagnosis,
        prescription,
      },
    });

    res.json({
      message: "Prescription added successfully",

      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
