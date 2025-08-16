import React, { useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName: name,bio})
      navigate("/");
      return;
    }

    const reader=new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload=async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image,fullName: name,bio});
      navigate('/');
    }
   
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg">
        {/* Form */}
        <form className="mt-6" onSubmit={handleUpdate}>
          {/* Profile Pic */}
          <div className="flex flex-col items-center">
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt=""
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <input
              type="file"
              id="avatar"
              hidden
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <label
              htmlFor="avatar"
              className="text-blue-400 text-sm cursor-pointer hover:underline"
            >
              Change Profile Picture
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none"
              value={name}
              placeholder="your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none"
              rows="4"
              placeholder="write profile bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
