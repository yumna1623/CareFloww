import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import DoctorStats from "../components/doctor/DoctorStats";
import DoctorQueue from "../components/doctor/DoctorQueue";
import ProfileCard from "../components/doctor/ProfileCard";
import LeaveManagement from "../components/doctor/LeaveManagement";

const DoctorDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    missedAppointments: 0,
  });

  const [queue, setQueue] = useState([]);

  const [profileImage, setProfileImage] = useState(
    user?.profileImage || ""
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user?.role === "doctor") {
      fetchDashboard();
      fetchQueue();
    }
  }, [user, loading]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/doctors/dashboard");

      setStats(data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchQueue = async () => {
    try {
      const { data } = await api.get("/doctors/queue");

      setQueue(data);
    } catch (err) {
      console.log(err.response?.data);
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

      <div className="bg-white rounded-2xl shadow border p-8 mb-8">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Welcome Dr. {user?.name}
            </h1>

            <p className="text-gray-500">
              {user?.email}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      <DoctorStats stats={stats} />

      <div className="grid lg:grid-cols-3 gap-8 mt-8">

        <div className="lg:col-span-2">

          <DoctorQueue
            queue={queue}
            refreshQueue={fetchQueue}
            refreshDashboard={fetchDashboard}
          />

        </div>

        <div className="space-y-8">

          <ProfileCard
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            user={user}
          />

          <LeaveManagement />

        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;