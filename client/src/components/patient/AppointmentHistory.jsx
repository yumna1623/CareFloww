import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const AppointmentHistory = ({ appointments }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow border p-6 mt-8">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">Appointment History</h2>
          <p className="text-sm text-slate-500 mt-1">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="text-slate-500">
          {isOpen ? (
            <ChevronUp size={24} />
          ) : (
            <ChevronDown size={24} />
          )}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <>
          {appointments.length === 0 ? (
            <p className="text-gray-500 mt-6">
              No appointments found.
            </p>
          ) : (
            <div className="overflow-x-auto mt-6">
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
                      className="border-b hover:bg-slate-50 transition"
                    >
                      <td className="py-4">
                        <div className="font-semibold">
                          Dr. {appointment.doctor.name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {appointment.doctor.specialization}
                        </div>
                      </td>

                      <td>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        {appointment.slotStartTime} -{" "}
                        {appointment.slotEndTime}
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
                              : appointment.status === "cancelled"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td>{appointment.diagnosis || "-"}</td>

                      <td>{appointment.prescription || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentHistory;