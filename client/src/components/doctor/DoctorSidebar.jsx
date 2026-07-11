import {
  LayoutDashboard, CalendarDays, UserCircle, Camera, LogOut, Stethoscope, ChevronLeft, ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";

const DoctorSidebar = ({ user, profileImage, logout, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute -right-3 top-8 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo */}
      <div className="px-8 py-7 border-b flex items-center justify-center">
        <h1 className={`font-bold text-blue-600 truncate ${isOpen ? 'text-2xl' : 'text-sm'}`}>
          {isOpen ? "CareFlow" : "CF"}
        </h1>
      </div>

      {/* Doctor Section (Hide details when closed) */}
      <div className="px-4 py-8 border-b flex flex-col items-center">
        <img src={profileImage || "/default-avatar.png"} className="w-16 h-16 rounded-full object-cover border-4 border-blue-100" />
        {isOpen && (
          <div className="text-center mt-3">
            <h2 className="font-bold text-sm">Dr. {user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px]">
              <Stethoscope size={12} /> {user?.specialization}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-2">
        {[
          { to: "/doctor/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
          { to: "/doctor/leave", icon: <CalendarDays size={20} />, label: "Leave Management" },
          { to: "/doctor/profile", icon: <UserCircle size={20} />, label: "Profile" },
          { to: "/doctor/upload-photo", icon: <Camera size={20} />, label: "Upload Photo" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {item.icon}
            {isOpen && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t">
        <button onClick={logout} className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100">
          <LogOut size={18} />
          {isOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
export default DoctorSidebar;