import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarClock,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const PatientLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const patientNavItems = [
    {
      to: "/patient/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/book-appointment",
      icon: <CalendarPlus size={20} />,
      label: "Book Appointment",
    },
    {
      to: "/my-appointments",
      icon: <CalendarClock size={20} />,
      label: "My Appointments",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="patient"
        user={user}
        profileImage={null}
        logout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navItems={patientNavItems}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-20"
        } p-8`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;