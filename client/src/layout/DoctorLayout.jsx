// src/layouts/DoctorLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DoctorSidebar from "../components/doctor/DoctorSidebar";

const DoctorLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <DoctorSidebar 
        user={user} 
        profileImage={user?.profileImage} 
        logout={handleLogout} 
      />
      <main className="flex-1 ml-72 p-10">
        <Outlet /> {/* This is where Dashboard, Leave, or Profile will render */}
      </main>
    </div>
  );
};
export default DoctorLayout;