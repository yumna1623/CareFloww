import { useState } from "react";
import api from "../../api/axios";

const ProfileCard = ({
  user,
  profileImage,
  setProfileImage,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const { data } = await api.post(
        "/doctors/profile/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileImage(data.image);

      alert(data.message);
    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <h2 className="text-2xl font-bold mb-6">
        Doctor Profile
      </h2>

      <div className="flex flex-col items-center">

        <img
          src={
            profileImage ||
            "https://ui-avatars.com/api/?name=Doctor"
          }
          alt="Doctor"
          className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
        />

        <h3 className="text-xl font-bold mt-5">
          Dr. {user?.name}
        </h3>

        <p className="text-gray-500">
          {user?.specialization}
        </p>

        <label className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg cursor-pointer transition">

          {uploading
            ? "Uploading..."
            : "Upload Picture"}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />

        </label>

      </div>

    </div>
  );
};

export default ProfileCard;