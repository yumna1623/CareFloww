import api from "../../api/axios";
const DoctorQueue = ({ queue, refreshQueue, refreshDashboard }) => {
  const handleStart = async (id) => {
    try {
      const { data } = await api.patch(`/appointments/start/${id}`);

      alert(data.message);

      refreshQueue();
      refreshDashboard();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message);
    }
  };
  const canStartConsultation = (appointment) => {
    const appointmentStart = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime.split(":").map(Number);

    appointmentStart.setHours(hour, minute, 0, 0);

    return new Date() >= appointmentStart;
  };

  

  const handleComplete = async (id) => {
    try {
      const { data } = await api.patch(`/appointments/complete/${id}`);

      alert(data.message);

      refreshQueue();
      refreshDashboard();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message);
    }
  };

  const handleMissed = async (id) => {
    try {
      const { data } = await api.patch(`/appointments/missed/${id}`);

      alert(data.message);

      refreshQueue();
      refreshDashboard();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message);
    }
  };

  // Returns true only when appointment end time has passed
  const canMarkMissed = (appointment) => {
    const appointmentEnd = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotEndTime.split(":").map(Number);

    appointmentEnd.setHours(hour, minute, 0, 0);

    return new Date() > appointmentEnd;
  };

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-2xl font-bold mb-4">Today's Queue</h2>

        <p className="text-gray-500">No appointments for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-2xl font-bold mb-6">Today's Queue</h2>

      <div className="space-y-5">
        {queue.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-xl p-5 hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {appointment.patient.name}
                </h3>

                <p className="text-gray-500">
                  Queue #{appointment.queuePosition}
                </p>

                <p className="mt-2">
                  Time: {appointment.slotStartTime} - {appointment.slotEndTime}
                </p>

                <p className="mt-1">
                  Status:{" "}
                  <span className="font-semibold capitalize">
                    {appointment.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {appointment.status === "pending" && (
                  <>
                    {canStartConsultation(appointment) ? (
                      <button
                        onClick={() => handleStart(appointment.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Start Consultation
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                      >
                        Waiting for Time
                      </button>
                    )}

                    {canMarkMissed(appointment) && (
                      <button
                        onClick={() => handleMissed(appointment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Mark Missed
                      </button>
                    )}
                  </>
                )}

                {appointment.status === "in_progress" && (
                  <button
                    onClick={() => handleComplete(appointment.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Complete Consultation
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorQueue;
