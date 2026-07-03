import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const PatientDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchAppointments();
    }
  }, [user, loading]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get(
        "/appointments/patient-dashboard"
      );

      console.log(data);

      // agar backend array return karta hai
      setAppointments(data.appointments);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div className="pt-24 px-10">Loading...</div>;

  return (
    <div className="pt-24 px-10">

      <div className="bg-white p-8 rounded-2xl shadow border mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}
        </h1>

        <p className="text-gray-500">
          {user?.email}
        </p>

        <div className="flex gap-4 mt-6">

          <button
            onClick={() => navigate("/book-appointment")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Book Appointment
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-2xl font-bold mb-6">
          Upcoming Appointments
        </h2>

        {loadingAppointments ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>You don't have any upcoming appointments yet.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 mb-4"
            >
              <h3 className="font-bold text-lg">
                Dr. {appointment.doctor.name}
              </h3>

              <p>
                <strong>Specialization:</strong>{" "}
                {appointment.doctor.specialization}
              </p>

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
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default PatientDashboard;