import {
  UserCircle,
  LogOut,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({
  user,
  profileImage,
  logout,
  isOpen,
  setIsOpen,
  navItems,
  role,
}) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-30 bg-white border-r border-slate-200 flex flex-col shadow-sm transition-[width] duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-8 bg-blue-600 text-white rounded-full p-1.5 shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
      >
        {isOpen ? (
          <ChevronLeft size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </button>

      {/* Logo */}
      <div className="h-[76px] px-6 border-b border-slate-100 flex items-center justify-center overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            {role === "doctor" ? (
              <Stethoscope size={16} className="text-white" />
            ) : (
              <UserCircle size={16} className="text-white" />
            )}
          </div>

          <span
            className={`font-bold text-xl text-slate-800 whitespace-nowrap transition-all duration-300 ${
              isOpen ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
            }`}
          >
            CareFlow
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-6 border-b border-slate-100 flex flex-col items-center">
        <img
          src={profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover border-4 border-blue-50 shadow-sm"
        />

        <div
          className={`text-center overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-28 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <h2 className="font-semibold text-sm text-slate-800 whitespace-nowrap">
            {role === "doctor" ? `Dr. ${user?.name}` : user?.name}
          </h2>

          <p className="text-xs text-slate-400 whitespace-nowrap">
            {user?.email}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">
            {role === "doctor" ? (
              <>
                <Stethoscope size={12} />
                {user?.specialization}
              </>
            ) : (
              <>
                <UserCircle size={12} />
                Patient
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            <span>{item.icon}</span>

            <span
              className={`text-sm whitespace-nowrap transition-all duration-300 ${
                isOpen ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition font-semibold text-sm"
        >
          <LogOut size={18} />

          <span
            className={`transition-all duration-300 whitespace-nowrap ${
              isOpen ? "opacity-100 max-w-[100px]" : "opacity-0 max-w-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;