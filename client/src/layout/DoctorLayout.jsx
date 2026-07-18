// src/layouts/DoctorLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  Camera,
} from "lucide-react";

const DoctorLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

const doctorNavItems = [
  {
    to: "/doctor/dashboard",
    icon: <LayoutDashboard outDashboard size={20} />,
    label: "Dashboard",
  },
  {
    to: "/doctor/leave",
    icon: <CalendarDays size={20} />,
    label: "Leave Management",
  },
  {
    to: "/doctor/upload-photo",
    icon: <Camera size={20} />,
    label: "Upload Photo",
  },
]; 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
     <Sidebar
    role="doctor"
    user={user}
    profileImage={user?.profileImage}
    logout={handleLogout}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    navItems={doctorNavItems}
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