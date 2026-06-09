import prisma from "../config/prisma.js";
import { calculateSlot } from "../utils/timeHelpers.js";
import { generateSlots } from "../utils/generateSlots.js";
import { getIO } from "../socket.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotStartTime, appointmentDate } = req.body;

    const patientId = req.user.id;

    // Doctor exists

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // DATE VALIDATION

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(appointmentDate);

    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot book past dates",
      });
    }
    const leave = await prisma.doctorLeave.findFirst({
      where: {
        doctorId,

        leaveDate: selectedDate,
      },
    });

    if (leave) {
      return res.status(400).json({
        message: "Doctor is unavailable on this date",
      });
    }
    // 7 day limit

    const maxDate = new Date();

    maxDate.setDate(maxDate.getDate() + 7);

    if (selectedDate > maxDate) {
      return res.status(400).json({
        message: "Can only book within 7 days",
      });
    }

    // PAST TIME VALIDATION

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

    // Generate slots

    const allSlots = generateSlots(
      doctor.availableStartTime,
      doctor.availableEndTime,
      doctor.consultationDuration,
    );

    const selectedSlot = allSlots.find((slot) => slot.start === slotStartTime);

    if (!selectedSlot) {
      return res.status(400).json({
        message: "Invalid slot",
      });
    }

    // Check already booked

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,

        appointmentDate: selectedDate,

        slotStartTime,

        status: {
          not: "cancelled",
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    const queuePosition =
      allSlots.findIndex((slot) => slot.start === slotStartTime) + 1;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,

        doctorId,

        appointmentDate: selectedDate,

        queuePosition,

        slotStartTime,

        slotEndTime: selectedSlot.end,

        estimatedWait: (queuePosition - 1) * doctor.consultationDuration,
      },
    });

    res.status(201).json({
      message: "Appointment booked",

      appointment,
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

export const getDoctorQueue = async (req, res) => {
  try {
    const queue = await prisma.appointment.findMany({
      where: {
        doctorId: req.user.id,
        status: "pending",
      },

      include: {
        patient: true,
      },

      orderBy: {
        queuePosition: "asc",
      },
    });

    res.json(queue);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // only owner can cancel
    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // delete appointment
    await prisma.appointment.delete({
      where: { id },
    });
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

    const appointment = await prisma.appointment.update({
      where: {
        id,
      },

      data: {
        status: "in-progress",
      },
    });
    getIO().emit("queueUpdated", {
      doctorId: appointment.doctorId,
    });

    res.json({
      message: "Consultation started",
      appointment,
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

    const appointment = await prisma.appointment.update({
      where: {
        id,
      },

      data: {
        status: "done",
      },
    });
    getIO().emit("queueUpdated", {
      doctorId: appointment.doctorId,
    });
    if (appointment.status !== "in-progress") {
      return res.status(400).json({
        message: "Consultation not started",
      });
    }

    res.json({
      message: "Consultation completed",
      appointment,
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

    res.json({
      upcomingAppointments,

      completedAppointments,

      missedAppointments,

      cancelledAppointments,
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
