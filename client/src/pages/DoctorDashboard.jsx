import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import DoctorStats from "../components/doctor/DoctorStats";
import DoctorQueue from "../components/doctor/DoctorQueue";
import DoctorSidebar from "../components/doctor/DoctorSidebar";

const DoctorDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    missedAppointments: 0,
  });

  const [queue, setQueue] = useState([]);

  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user?.role === "doctor") {
      fetchDashboard(selectedDate);
      fetchQueue(selectedDate);
    }
  }, [user, loading, selectedDate]);

  const fetchDashboard = async (date = selectedDate) => {
    try {
      const { data } = await api.get(`/doctors/dashboard?date=${date}`);
      setStats(data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchQueue = async (date = selectedDate) => {
    try {
      const { data } = await api.get(`/doctors/queue?date=${date}`);
      setQueue(data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="ml-72 min-h-screen bg-slate-100">
      {/* Sidebar */}
      <DoctorSidebar
        user={user}
        profileImage={profileImage}
        logout={handleLogout}
      />
      {/* <DoctorSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        logout={handleLogout}
      /> */}

      <div className="px-6 lg:px-10 py-8">
        {/* Header */}

        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
            <h1 className="text-3xl font-bold">Welcome, Dr. {user?.name}</h1>

            <p className="text-slate-500 mt-2">
              Here's today's appointments and queue.
            </p>

            {/* Inside DoctorDashboard.jsx Header Section */}
          </div>
        </div>

        {/* Stats */}

        <DoctorStats stats={stats} />

        {/* Queue */}

        <div className="mt-8">
          <DoctorQueue
            queue={queue}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            refreshQueue={() => fetchQueue(selectedDate)}
            refreshDashboard={() => fetchDashboard(selectedDate)}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
