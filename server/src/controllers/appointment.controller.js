import prisma from "../config/prisma.js";

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const patientId = req.user.id;

    // check doctor exists

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

    // count current queue

    const count = await prisma.appointment.count({
      where: {
        doctorId,
        status: "pending",
      },
    });

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        queuePosition: count + 1,
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

    await prisma.appointment.delete({
      where: { id },
    });

    // recalculate queue

    const remainingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: appointment.doctorId,
        status: "pending",
      },
      orderBy: {
        queuePosition: "asc",
      },
    });

    for (let i = 0; i < remainingAppointments.length; i++) {
      await prisma.appointment.update({
        where: {
          id: remainingAppointments[i].id,
        },
        data: {
          queuePosition: i + 1,
        },
      });
    }

    res.json({
      message: "Appointment cancelled and queue updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
