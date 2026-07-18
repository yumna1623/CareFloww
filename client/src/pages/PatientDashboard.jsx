import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import DashboardCards from "../components/patient/DashboardCards";
import UpcomingAppointments from "../components/patient/UpcomingAppointments";
// import AppointmentHistory from "../components/patient/AppointmentHistory";

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

      setStats({
        upcomingAppointments: data.upcomingAppointments || 0,
        completedAppointments: data.completedAppointments || 0,
        missedAppointments: data.missedAppointments || 0,
        cancelledAppointments: data.cancelledAppointments || 0,
      });

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

  if (loading) {
    return (
      <div className="pt-24 px-10 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow border p-8 mb-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {user?.email}
            </p>
          </div>


        </div>

      </div>

      {/* Dashboard Statistics */}
      <DashboardCards stats={stats} />

      {/* Upcoming Appointments */}
      <div className="mt-8">
        {loadingAppointments ? (
          <div className="bg-white rounded-xl shadow border p-6">
            Loading appointments...
          </div>
        ) : (
          <UpcomingAppointments
            appointments={appointments}
          />
        )}
      </div>

    </div>
  );
};

export default PatientDashboard;