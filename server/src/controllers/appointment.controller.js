import prisma from "../config/prisma.js";
import { calculateSlot } from "../utils/timeHelpers.js";
import { generateSlots } from "../utils/generateSlots.js";
import { getIO } from "../socket.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotStartTime } = req.body;
    const patientId = req.user.id;

    // 1. Check doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // 2. Generate all slots
    const allSlots = generateSlots(
      doctor.availableStartTime,
      doctor.availableEndTime,
      doctor.consultationDuration,
    );

    // 3. Validate selected slot
    const selectedSlot = allSlots.find((slot) => slot.start === slotStartTime);

    if (!selectedSlot) {
      return res.status(400).json({
        message: "Invalid slot",
      });
    }

    // 4. Check if slot already booked
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
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

    // 5. Queue position based on slot order
    const queuePosition =
      allSlots.findIndex((slot) => slot.start === slotStartTime) + 1;

    // 6. Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,

        queuePosition,

        slotStartTime,
        slotEndTime: selectedSlot.end,

        estimatedWait: (queuePosition - 1) * doctor.consultationDuration,
      },
    });
    getIO().emit(
  "queueUpdated",
  {
    doctorId:
      appointment.doctorId,
  }
);
console.log(
  "queueUpdated emitted",
  appointment.doctorId
);

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
    getIO().emit(
  "queueUpdated",
  {
    doctorId:
      appointment.doctorId,
  }
);

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
    getIO().emit(
  "queueUpdated",
  {
    doctorId:
      appointment.doctorId,
  }
);

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
    getIO().emit(
  "queueUpdated",
  {
    doctorId:
      appointment.doctorId,
  }
);
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
