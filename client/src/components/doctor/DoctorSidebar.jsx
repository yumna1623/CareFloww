import { X, Menu } from "lucide-react";
import ProfileCard from "./ProfileCard";
import LeaveManagement from "./LeaveManagement";

const DoctorSidebar = ({
  open,
  setOpen,
  user,
  profileImage,
  setProfileImage,
  logout,
}) => {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-5 left-5 z-40 bg-blue-600 text-white p-3 rounded-lg shadow-lg"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">
            Doctor Panel
          </h2>

          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        {/* Doctor Info */}

        <div className="p-6 text-center border-b">

          <img
            src={
              profileImage ||
              "https://ui-avatars.com/api/?name=Doctor"
            }
            alt=""
            className="w-28 h-28 rounded-full mx-auto object-cover border"
          />

          <h3 className="text-xl font-bold mt-4">
            Dr. {user.name}
          </h3>

          <p className="text-gray-500">
            {user.email}
          </p>

        </div>

        {/* Update Profile */}

        <div className="p-5 border-b">
          <ProfileCard
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            user={user}
          />
        </div>

        {/* Leave */}

        <div className="p-5 border-b">
          <LeaveManagement />
        </div>

        {/* Logout */}

        <div className="p-5">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;