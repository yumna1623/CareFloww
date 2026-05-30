import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    let user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      user =
        await prisma.doctor.findUnique({
          where: {
            id: decoded.id,
          },
        });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    req.role = decoded.role;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;