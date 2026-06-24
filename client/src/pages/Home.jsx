// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative h-screen w-full bg-slate-900 text-white flex items-center justify-center">
      {/* Background overlay/gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl font-extrabold mb-6">CareFlow HMS</h1>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Modern Hospital Management System. Secure patient records, 
          real-time appointment tracking, and doctor queue management.
        </p>
        <div className="space-x-4">
          <Link to="/signup" className="px-8 py-4 bg-blue-600 rounded-full font-bold hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-4 border border-white rounded-full font-bold hover:bg-white hover:text-slate-900 transition">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;