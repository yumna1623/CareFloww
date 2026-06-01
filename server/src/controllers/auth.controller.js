import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";


export const patientSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const patient =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "patient",
        },
      });

    const token = generateToken(
      patient.id,
      patient.role
    );

    res.status(201).json({
      token,
      patient,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const doctorSignup = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,

      specialization,
      availableStartTime,
      availableEndTime,
      consultationDuration,
    } = req.body;

    const existingDoctor =
      await prisma.doctor.findUnique({
        where: {
          email,
        },
      });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const doctor =
      await prisma.doctor.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "doctor",

          specialization,
          availableStartTime,
          availableEndTime,
          consultationDuration,
        },
      });

    const token = generateToken(
      doctor.id,
      "doctor"
    );

    res.status(201).json({
      token,
      doctor,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (
  req,
  res
) => {
  try {

    const {
      email,
      password,
    } = req.body;

    let account =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    let role = "patient";

    if (!account) {

      account =
        await prisma.doctor.findUnique({
          where: {
            email,
          },
        });

      role = "doctor";
    }

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        account.password
      );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token =
      generateToken(
        account.id,
        role
      );

    res.json({
      token,
      role,
      account,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMe = async (
  req,
  res
) => {

  res.json({
    user: req.user,
    role: req.role,
  });

};