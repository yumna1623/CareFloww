import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    doctorSecret: "",
    specialization: "",
    availableStartTime: "",
    availableEndTime: "",
    consultationDuration: "",
  });
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === "doctor") {
        await api.post("/auth/doctor/signup", formData);
        alert("Doctor signup successful!");
        navigate("/login"); // Doctor ko login bhejna sahi hai
      } else {
        const { data } = await api.post("/auth/patient/signup", formData);
        alert("Patient signup successful!");
        
        // Yahan redirection add karein:
        localStorage.setItem("token", data.token); // Token save karein
        // Note: Yahan aapko Context ka setUser/setRole bhi update karna pad sakta hai
        navigate("/patient/dashboard"); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen pt-20">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Full Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {role === "doctor" && (
          <>
            <input
              className="w-full p-2 mb-4 border rounded"
              placeholder="Specialization (e.g. Cardiology)"
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
            />

            {/* Start Time Setter */}
            <label className="block text-sm text-gray-600 mb-1">
              Start Time (e.g., 09:00)
            </label>
            <input
              type="time"
              className="w-full p-2 mb-4 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, availableStartTime: e.target.value })
              }
            />

            {/* End Time Setter */}
            <label className="block text-sm text-gray-600 mb-1">
              End Time (e.g., 17:00)
            </label>
            <input
              type="time"
              className="w-full p-2 mb-4 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, availableEndTime: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Consultation Duration (minutes)"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consultationDuration: parseInt(e.target.value),
                })
              }
            />

            <input
              className="w-full p-2 mb-6 border-2 border-blue-500 rounded"
              placeholder="Secret Key"
              onChange={(e) =>
                setFormData({ ...formData, doctorSecret: e.target.value })
              }
            />
          </>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};
export default Signup;
