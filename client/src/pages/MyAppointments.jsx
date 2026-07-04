import { useEffect, useState } from "react";
import api from "../api/axios";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get(
        "/appointments/my-appointments"
      );

      setAppointments(data);
    } catch (err) {
      console.log(err);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "done":
        return "bg-green-100 text-green-700";

      case "missed":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="pt-24 px-10">

      <h1 className="text-3xl font-bold mb-8">
        My Appointments
      </h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white border rounded-xl shadow p-6 mb-5"
          >
            <div className="flex justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Dr. {appointment.doctor.name}
                </h2>

                <p className="text-gray-500">
                  {appointment.doctor.specialization}
                </p>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>

            </div>

            <div className="mt-5 space-y-2">

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  appointment.appointmentDate
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.slotStartTime} -{" "}
                {appointment.slotEndTime}
              </p>

              <p>
                <strong>Queue Position:</strong>{" "}
                {appointment.queuePosition}
              </p>

              <p>
                <strong>Estimated Wait:</strong>{" "}
                {appointment.estimatedWait ?? "--"} min
              </p>

            </div>
          </div>
        ))
      )}

    </div>
  );
};

export default MyAppointments;