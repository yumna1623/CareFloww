// src/pages/DoctorDashboard.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import DoctorStats from "../components/doctor/DoctorStats";
import DoctorQueue from "../components/doctor/DoctorQueue";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatReadableDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const DoctorDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const isToday =
    selectedDate === new Date().toISOString().split("T")[0];

  return (
    <div >
      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        {/* subtle accent */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-blue-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row justify-between lg:items-center gap-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase mb-1">
              {getGreeting()}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
              Dr. {user?.name}
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm">
              Here's an overview of your appointments and queue.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              {isToday ? "Today" : "Viewing"}
            </span>
            <span className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full">
              {formatReadableDate(selectedDate)}
            </span>
          </div>
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
  );
};

export default DoctorDashboard;