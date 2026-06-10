import prisma from "../config/prisma.js";

export const addReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;

    const patientId = req.user.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId,
        doctorId,

        status: "done",
      },
    });

    if (!appointment) {
      return res.status(400).json({
        message: "Complete consultation first",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        patientId,
        doctorId,
      },
    });
    const existingReview = await prisma.review.findFirst({
      where: {
        patientId,
        doctorId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this doctor",
      });
    }

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
