import React from "react";
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../utils/data";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const SideMenu = ({ activeMenu, isBlogMenu, setOpenSideMenu }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    console.log("route:", route);
    setOpenSideMenu((prevState) => !prevState);
    navigate(route);
  };
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setOpenSideMenu((prevState) => !prevState);
    navigate("/");
  };
  return (
    <div className="w-56 h-[calc(100vh-73px)] bg-white border-r border-purple-100/50 p-6 sticky top-[73px] z-50 shadow-lg overflow-y-auto">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-pink-400/10 to-transparent rounded-full blur-2xl"></div>

      {user && (
        <div className="relative flex flex-col items-center justify-center gap-3 mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50 shadow-sm">
          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile Image"
                className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="relative ring-4 ring-white shadow-lg">
                <CharAvatar
                  fullName={user?.name || ""}
                  width="w-20"
                  height="h-20"
                  style="text-xl"
                />
              </div>
            )}
            {/* Online Status */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h5 className="text-gray-900 font-bold text-base leading-tight mb-1">
              {user.name || ""}
            </h5>
            <p className="text-xs font-medium text-gray-600">
              {user.email || ""}
            </p>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="relative space-y-2">
        {(isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA).map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`group w-full flex items-center gap-3 text-[15px] font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
              activeMenu === item.label || activeMenu === item.id
                ? "bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                : "text-gray-700 hover:bg-white/80 hover:text-purple-600 hover:shadow-md hover:scale-102"
            }`}
            onClick={() => handleClick(item.path)}
          >
            <div
              className={`p-2 rounded-lg transition-all duration-300 ${
                activeMenu === item.label || activeMenu === item.id
                  ? "bg-white/20"
                  : "bg-purple-50 group-hover:bg-purple-100"
              }`}
            >
              <item.icon className="text-xl" />
            </div>
            <span className="flex-1 text-left">{item.label}</span>
            {(activeMenu === item.label || activeMenu === item.id) && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      {user && (
        <div className="relative mt-6 pt-6 border-t border-purple-100/50">
          <button
            className="group w-full flex items-center gap-3 text-[15px] font-semibold py-3 px-4 rounded-xl bg-linear-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
            onClick={() => handleLogout()}
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <LuLogOut className="text-xl" />
            </div>
            <span className="flex-1 text-left">Logout</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
