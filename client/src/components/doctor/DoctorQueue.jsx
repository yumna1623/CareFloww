import api from "../../api/axios";

const DoctorQueue = ({
  queue,
  selectedDate,
  setSelectedDate,
  refreshQueue,
  refreshDashboard,
}) => {
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

  const canStartConsultation = (appointment) => {
    const appointmentStart = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotStartTime.split(":").map(Number);

    appointmentStart.setHours(hour, minute, 0, 0);

    return new Date() >= appointmentStart;
  };

  const canMarkMissed = (appointment) => {
    const appointmentEnd = new Date(appointment.appointmentDate);

    const [hour, minute] = appointment.slotEndTime.split(":").map(Number);

    appointmentEnd.setHours(hour, minute, 0, 0);

    return new Date() > appointmentEnd;
  };

  const badgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "done":
        return "bg-green-100 text-green-700";

      case "missed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow border">

      {/* Header */}

      <div className="border-b p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Appointment Queue
          </h2>

          <p className="text-gray-500 mt-1">
            View appointments for any selected date.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <label className="font-medium text-gray-600">
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* Empty State */}

      {queue.length === 0 ? (
        <div className="py-20 text-center">

          <div className="text-6xl mb-3">
            📅
          </div>

          <h3 className="text-xl font-semibold">
            No appointments found
          </h3>

          <p className="text-gray-500 mt-2">
            There are no appointments scheduled for this date.
          </p>

        </div>
      ) : (
        <div className="p-6 space-y-5">

          {queue.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-2xl p-6 hover:shadow-lg transition duration-300"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">

                {/* Left */}

                <div className="flex gap-4">

                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                    {appointment.patient.name.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {appointment.patient.name}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>

                    <p className="mt-2">
                      <span className="font-semibold">
                        Queue:
                      </span>{" "}
                      #{appointment.queuePosition}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Time:
                      </span>{" "}
                      {appointment.slotStartTime} -{" "}
                      {appointment.slotEndTime}
                    </p>

                    <div className="mt-3">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${badgeColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="flex flex-col justify-center gap-3 min-w-[220px]">

                  {appointment.status === "pending" && (
                    <>
                      {canStartConsultation(appointment) ? (
                        <button
                          onClick={() =>
                            handleStart(appointment.id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                          ▶ Start Consultation
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed"
                        >
                          Waiting for Time
                        </button>
                      )}

                      {canMarkMissed(appointment) && (
                        <button
                          onClick={() =>
                            handleMissed(appointment.id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                          Mark Missed
                        </button>
                      )}
                    </>
                  )}

                  {appointment.status === "in-progress" && (
                    <button
                      onClick={() =>
                        handleComplete(appointment.id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      ✓ Complete Consultation
                    </button>
                  )}

                  {appointment.status === "done" && (
                    <div className="bg-green-100 text-green-700 rounded-xl py-3 text-center font-semibold">
                      Consultation Completed
                    </div>
                  )}

                  {appointment.status === "missed" && (
                    <div className="bg-red-100 text-red-700 rounded-xl py-3 text-center font-semibold">
                      Patient Missed
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default DoctorQueue;