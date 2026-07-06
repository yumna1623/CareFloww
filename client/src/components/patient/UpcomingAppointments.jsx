const UpcomingAppointments = ({ appointments }) => {
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold mb-4">
          Upcoming Appointments
        </h2>

        <p className="text-gray-500">
          You don't have any upcoming appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-2xl font-bold mb-6">
        Upcoming Appointments
      </h2>

      <div className="space-y-5">
        {upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  Dr. {appointment.doctor.name}
                </h3>

                <p className="text-gray-500">
                  {appointment.doctor.specialization}
                </p>

                <div className="mt-4 space-y-2">
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
                    <strong>Queue Number:</strong>{" "}
                    <span className="font-bold text-blue-600">
                      #{appointment.queuePosition}
                    </span>
                  </p>

                  {appointment.estimatedWait !== null && (
                    <p>
                      <strong>Estimated Wait:</strong>{" "}
                      {appointment.estimatedWait} min
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 items-end">
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                  {appointment.status}
                </span>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  Queue #{appointment.queuePosition}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;