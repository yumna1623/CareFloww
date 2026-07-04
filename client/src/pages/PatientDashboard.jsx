import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DashboardCards from "../components/patient/DashboardCards";
import AppointmentHistory from "../components/patient/AppointmentHistory";
import UpcomingAppointments from "../components/patient/UpcomingAppointments";

const PatientDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    missedAppointments: 0,
    cancelledAppointments: 0,
  });

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

      // Statistics
      setStats({
        upcomingAppointments: data.upcomingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        missedAppointments: data.missedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
      });

      // Appointments Array
      setAppointments(data.appointments || []);
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

  if (loading)
    return <div className="pt-24 px-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-8">

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow border mb-8">

        <div className="flex justify-between items-center flex-wrap gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.name}
            </h1>

            <p className="text-gray-500">
              {user?.email}
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/book-appointment")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Book Appointment
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

      {/* Dashboard Cards */}
      <DashboardCards stats={stats} />

      {/* Upcoming Appointments */}
      {loadingAppointments ? (
        <div className="bg-white rounded-xl shadow border p-6 mt-8">
          Loading...
        </div>
      ) : (
        <UpcomingAppointments appointments={appointments} />
        
      )}
      <AppointmentHistory appointments={appointments} />
      <button
    onClick={() => navigate("/my-appointments")}
    className="bg-green-600 text-white px-6 py-2 rounded-lg"
>
    My Appointments
</button>

    </div>
  );
};

export default PatientDashboard;