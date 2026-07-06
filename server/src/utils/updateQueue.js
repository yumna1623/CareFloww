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

  for (let i = 0; i < appointments.length; i++) {
    await prisma.appointment.update({
      where: {
        id: appointments[i].id,
      },
      data: {
        queuePosition: i + 1,
      },
    });
  }
};