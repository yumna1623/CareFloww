// src/layouts/DoctorLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DoctorSidebar from "../components/doctor/DoctorSidebar";

const DoctorLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar
        user={user}
        profileImage={user?.profileImage}
        logout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <main
        className={`flex-1 transition-[margin] duration-300 ease-in-out p-6 lg:p-10 ${
          isOpen ? "ml-72" : "ml-20"
        }`}
      >
        <Outlet /> {/* This is where Dashboard, Leave, or Profile will render */}
      </main>
    </div>
  );
};

export default DoctorLayout;