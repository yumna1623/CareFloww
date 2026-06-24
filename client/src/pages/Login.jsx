import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setUser, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

// Inside Login.jsx, update the handleSubmit logic:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      
      setUser(data.account);
      setRole(data.role);
      

      // REDIRECTION LOGIC
      if (data.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard'); // Redirects to booking page
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input 
          className="w-full p-2 mb-4 border rounded" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          className="w-full p-2 mb-6 border rounded" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Log In</button>
      </form>
    </div>
  );
};

export default Login;