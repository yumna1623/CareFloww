// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      setUser(data.account);
      setRole(data.role);
      data.role === 'doctor' ? navigate('/doctor/dashboard') : navigate('/patient/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Side: Branding/Info */}
        <div className="bg-blue-900 p-12 text-white hidden md:flex flex-col justify-center">
          <h2 className="text-4xl font-black mb-6">New here?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join us today and discover a world of possibilities. 
            Streamline your clinical workflow in seconds.
          </p>
          <Link 
            to="/signup" 
            className="w-full text-center border-2 border-white/30 py-3 rounded-xl font-bold hover:bg-white/10 transition"
          >
            Create an Account
          </Link>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Sign in</h2>
          <p className="text-slate-500 mb-8">Welcome back to CareFlow.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
              placeholder="Email Address" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <input 
              type="password" 
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition" 
              placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
            <button className="w-full mt-4 bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-200">
              LOGIN
            </button>
          </form>

          {/* Social Platforms */}
          <div className="mt-8">
            <div className="flex items-center gap-4 text-slate-400 mb-6">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-sm">Or sign in with</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">Google</button>
              <button className="py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition">LinkedIn</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;