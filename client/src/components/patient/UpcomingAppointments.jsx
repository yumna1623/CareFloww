import { useNavigate } from "react-router-dom";

const UpcomingAppointments = ({ appointments }) => {
  const navigate = useNavigate();

  if (!appointments.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">
          Upcoming Appointments
        </h2>

        <p className="text-gray-500">
          No upcoming appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">
        Upcoming Appointments
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((app) => (
            <tr
              key={app.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-4">
                Dr. {app.doctor.name}
              </td>

              <td>
                {new Date(
                  app.appointmentDate
                ).toLocaleDateString()}
              </td>

              <td>
                {app.slotStartTime} - {app.slotEndTime}
              </td>

              <td>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate("/book-appointment")}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Book Another Appointment
      </button>
    </div>
  );
};

export default UpcomingAppointments;