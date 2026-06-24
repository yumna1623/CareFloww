import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import api from '../api/axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({});
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // 2. Initialize navigate

  // 3. Logout Function
  const handleLogout = () => {
    localStorage.clear(); 
    
    // 2. Auth Context se state null karein (agar hook use kar rahe hain)
    logout(); 
    
    console.log("Logout successful, navigating to login...");
  // 3. Sabse important: Browser ko bole ki sab kuch bhool kar login par jaye
  window.location.replace('/login');
};

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/doctors/dashboard');
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="pt-24 px-10">
      {/* Dashboard Header with Logout Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="p-6 bg-blue-100 rounded-lg">
          <p className="text-sm">Today's Appts</p>
          <p className="text-2xl font-bold">{stats.todayAppointments || 0}</p>
        </div>
        <div className="p-6 bg-yellow-100 rounded-lg">
          <p className="text-sm">Pending</p>
          <p className="text-2xl font-bold">{stats.pendingAppointments || 0}</p>
        </div>
        <div className="p-6 bg-green-100 rounded-lg">
          <p className="text-sm">Completed</p>
          <p className="text-2xl font-bold">{stats.completedAppointments || 0}</p>
        </div>
        <div className="p-6 bg-red-100 rounded-lg">
          <p className="text-sm">Missed</p>
          <p className="text-2xl font-bold">{stats.missedAppointments || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;