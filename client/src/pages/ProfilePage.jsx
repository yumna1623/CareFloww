import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/doctor/ProfileCard";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="max-w-2xl">
      <ProfileCard user={user} profileImage={user?.profileImage} />
    </div>
  );
};
export default ProfilePage;