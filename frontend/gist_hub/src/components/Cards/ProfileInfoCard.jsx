import React from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };
  return (
    user && (
      <div className="flex items-center">
        <img
          src={user?.profileImageUrl || ""}
          alt="Profile Image"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3"
        />
        <div className="flex flex-col text-[15px] text-black font-bold leading-3 ">
          {user?.name || "User Name"}
      
        <button
          className="text-sky-600 font-semibold cursor-pointer hover:underline mt-2"
          onClick={handleLogout}
        >
          Logout
        </button>
         </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
