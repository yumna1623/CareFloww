import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { updateQueue } from "../utils/updateQueue.js";
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
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        reviews: {
          include: {
            patient: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const totalReviews = doctor.reviews.length;

    const averageRating =
      totalReviews > 0
        ? (
            doctor.reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    res.json({
      ...doctor,

      averageRating: Number(averageRating),

      totalReviews,
    });
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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    const appointmentTime = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime.split(":").map(Number);

    appointmentTime.setHours(hour, minute, 0, 0);

    if (new Date() < appointmentTime) {
      return res.status(400).json({
        message: "Cannot mark patient missed before appointment time.",
      });
    }

    const updated = await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status: "missed",
      },
    });
    await updateQueue(appointment.doctorId, appointment.appointmentDate);
    getIO().emit("queueUpdated", {
      doctorId: appointment.doctorId,
    });

    res.json({
      message: "Patient marked as missed",
      appointment: updated,
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

    console.log("=================================");
    console.log("getAvailableSlots called");
    console.log("Doctor ID:", id);
    console.log("Date:", date);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      console.log("Doctor not found");
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    console.log("Doctor Found:");
    console.log(doctor);

    console.log("Start Time:", doctor.availableStartTime);
    console.log("End Time:", doctor.availableEndTime);
    console.log("Duration:", doctor.consultationDuration);

    const allSlots = generateSlots(
      doctor.availableStartTime,
      doctor.availableEndTime,
      doctor.consultationDuration
    );

    console.log("Generated Slots:", allSlots);
    console.log("Total Slots:", allSlots.length);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: new Date(date),
        status: {
          not: "cancelled",
        },
      },
    });

    console.log("Booked Appointments:", bookedAppointments);

    const availableSlots = allSlots.map((slot) => ({
      ...slot,
      available: !bookedAppointments.some(
        (app) => app.slotStartTime === slot.start
      ),
    }));

    console.log("Available Slots:", availableSlots);
    console.log("=================================");

    return res.json(availableSlots);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
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
    tomorrow.setDate(today.getDate() + 1);

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
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const completedAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        status: "done",
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const missedAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        status: "missed",
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
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
// In your backend controller file
export const getDoctorLeaves = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const leaves = await prisma.doctorLeave.findMany({
      where: {
        doctorId: doctorId,
      },
      orderBy: {
        leaveDate: "asc", // Sort by date
      },
    });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File required",
      });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "careflow/doctors/profile",
      },
    );

    const doctor = await prisma.doctor.update({
      where: {
        id: req.user.id,
      },

      data: {
        profileImage: result.secure_url,
      },
    });

    res.json({
      message: "Profile uploaded",

      image: doctor.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
