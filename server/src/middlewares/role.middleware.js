const doctorOnly = (req, res, next) => {
  if (req.role !== "doctor") {
    return res.status(403).json({
      message: "Doctor access only",
    });
  }

  next();
};

const patientOnly = (req, res, next) => {
  if (req.role !== "patient") {
    return res.status(403).json({
      message: "Patient access only",
    });
  }

  next();
};

export { doctorOnly, patientOnly };
