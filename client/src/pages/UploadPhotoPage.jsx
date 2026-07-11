// src/pages/doctor/UploadPhotoPage.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileCard from "../components/doctor/ProfileCard";

const UploadPhotoPage = () => {
  const { user, setUser } = useContext(AuthContext);

  const setProfileImage = (newImage) => {
    setUser({ ...user, profileImage: newImage });
  };

  return (
    <div className="max-w-xl">
      <ProfileCard 
        user={user} 
        profileImage={user?.profileImage} 
        setProfileImage={setProfileImage} 
      />
    </div>
  );
};

export default UploadPhotoPage;