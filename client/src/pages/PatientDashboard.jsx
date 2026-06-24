import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PatientDashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="pt-24 px-10">Loading...</div>;

  return (
    <div className="pt-24 px-10">
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-gray-500 text-lg">{user?.email}</p>
        
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={() => navigate('/book-appointment')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Book Appointment
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Appointment History ya upcoming section yahan aayega */}
      <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-900">Your Appointments</h2>
        <p className="text-blue-700">You don't have any upcoming appointments yet.</p>
      </div>
    </div>
  );
};

export default PatientDashboard;