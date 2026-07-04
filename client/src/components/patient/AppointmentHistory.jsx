const AppointmentHistory = ({ appointments }) => {
  if (!appointments.length) {
    return (
      <div className="bg-white rounded-xl shadow border p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Appointment History
        </h2>

        <p className="text-gray-500">
          No appointments found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Appointment History
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-3">Doctor</th>

              <th>Date</th>

              <th>Time</th>

              <th>Status</th>

              <th>Diagnosis</th>

              <th>Prescription</th>

            </tr>

          </thead>

          <tbody>

            {appointments.map((appointment) => (

              <tr
                key={appointment.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="py-4">
                  <div className="font-semibold">
                    Dr. {appointment.doctor.name}
                  </div>

                  <div className="text-sm text-gray-500">
                    {appointment.doctor.specialization}
                  </div>
                </td>

                <td>
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {appointment.slotStartTime} - {appointment.slotEndTime}
                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "pending"
                        ? "bg-blue-100 text-blue-700"
                        : appointment.status === "done"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "missed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {appointment.status}
                  </span>

                </td>

                <td>
                  {appointment.diagnosis || "-"}
                </td>

                <td>
                  {appointment.prescription || "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AppointmentHistory;