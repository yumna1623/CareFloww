import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Logic: Kis page par kya dikhana hai
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname === '/book-appointment';

  return (
    <nav className="sticky top-0 w-full z-50 flex justify-between items-center px-10 py-6 bg-white/20 backdrop-blur-md border-b border-white/20 shadow-lg">
      {/* <Link to="/" className="text-3xl font-bold text-blue-900 tracking-tighter">CareFlow</Link> */}

      <div className="flex items-center space-x-8 text-blue-900 font-medium">
        
        {/* Case 1: Home Page - Just Home, Contact, About */}
        {isHomePage && (
          <>
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
            <Link to="/login" className="px-5 py-2 border border-blue-900 rounded-full hover:bg-blue-900 hover:text-white transition">Login</Link>
          </>
        )}


        {/* Case 3: Login/Signup Pages - Normal view */}
        {!isHomePage && !isDashboard && (
          <Link to="/" className="hover:text-blue-600">Back to Home</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;