import prisma from "../config/prisma.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialization: true,
        availableStartTime: true,
        availableEndTime: true,
        consultationDuration: true,
        createdAt: true,
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
