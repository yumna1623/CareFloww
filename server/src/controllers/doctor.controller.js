import prisma from "../config/prisma.js";
import { generateSlots } from "../utils/generateSlots.js";

export const getAllDoctors = async (req, res) => {
  try {
    const { name, specialization } = req.query;

    const doctors = await prisma.doctor.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),

        ...(specialization && {
          specialization: {
            contains: specialization,
            mode: "insensitive",
          },
        }),
      },

      select: {
        id: true,
        name: true,
        specialization: true,
        availableStartTime: true,
        availableEndTime: true,
        consultationDuration: true,
      },
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        specialization: true,
        availableStartTime: true,
        availableEndTime: true,
        consultationDuration: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  res.json(req.user); //Because middleware already fetched user → improves performance
};

export const updateProfile = async (req, res) => {
  try {
    const doctor = await prisma.doctor.update({
      where: {
        id: req.user.id,
      },
      data: req.body,
    });

    res.json({
      message: "Profile updated",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markMissed = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.update({
      where: {
        id,
      },

      data: {
        status: "missed",
      },
    });

    res.json({
      message: "Patient marked missed",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { id, date } = req.params;
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const allSlots = generateSlots(
      doctor.availableStartTime,
      doctor.availableEndTime,
      doctor.consultationDuration,
    );

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,

        status: {
          not: "cancelled",
        },
      },
    });

    const availableSlots = allSlots.map((slot) => {
      const booked = bookedAppointments.some(
        (app) => app.slotStartTime === slot.start,
      );

      return {
        ...slot,
        available: !booked,
      };
    });

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await prisma.appointment.count({
      where: {
        doctorId,

        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const pendingAppointments = await prisma.appointment.count({
      where: {
        doctorId,

        status: "pending",
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        doctorId,

        status: "done",
      },
    });

    const missedAppointments = await prisma.appointment.count({
      where: {
        doctorId,

        status: "missed",
      },
    });

    res.json({
      todayAppointments,

      pendingAppointments,

      completedAppointments,

      missedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addLeaveDate = async (req, res) => {
  try {
    const { leaveDate } = req.body;

    const doctorId = req.user.id;

    const leave = await prisma.doctorLeave.create({
      data: {
        doctorId,
        leaveDate: new Date(leaveDate),
      },
    });

    res.status(201).json({
      message: "Leave date added",
      leave,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
