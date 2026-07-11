// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname === '/book-appointment';

  return (
    // 'fixed' with top-4 and mx-4 creates the margin from top and sides
    <nav className="fixed top-4 left-4 right-4 z-50 flex justify-between items-center px-8 py-4 
                    bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl">
      
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-black text-blue-900 tracking-tighter">
        CareFlow<span className="text-teal-600">.</span>
      </Link>

      <div className="flex items-center space-x-8 text-blue-900 font-semibold">
        {/* Case 1: Home Page Links */}
        {isHomePage && (
          <>
            <a href="#about" className="hover:text-teal-600 transition">About</a>
            <a href="#contact" className="hover:text-teal-600 transition">Contact</a>
            <Link to="/login" className="px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition shadow-md">
              Login
            </Link>
          </>
        )}

        {/* Case 2: Dashboard/Internal Pages */}
        {isDashboard && (
          <span className="text-slate-500 text-sm italic">
            Welcome, {user?.name || "User"}
          </span>
        )}

        {/* Case 3: Back to Home */}
        {!isHomePage && !isDashboard && (
          <Link to="/" className="hover:text-blue-600 transition">← Back to Home</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;