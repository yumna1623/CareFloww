import prisma from "../config/prisma.js";

export const updateQueue = async (doctorId, appointmentDate) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate,
      status: {
        in: ["pending", "in-progress"],
      },
    },

    orderBy: [
      {
        slotStartTime: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  const now = new Date();

  for (let i = 0; i < appointments.length; i++) {
    const appointment = appointments[i];

    const appointmentStart = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime
      .split(":")
      .map(Number);

    appointmentStart.setHours(hour, minute, 0, 0);

    let estimatedWait = 0;

    if (appointment.status === "in-progress") {
      estimatedWait = 0;
    } else if (appointmentStart > now) {
      estimatedWait = Math.ceil(
        (appointmentStart.getTime() - now.getTime()) /
          (1000 * 60),
      );
    }

    await prisma.appointment.update({
      where: {
        id: appointment.id,
      },

      data: {
        queuePosition: i + 1,
        estimatedWait,
      },
    });
  }
};