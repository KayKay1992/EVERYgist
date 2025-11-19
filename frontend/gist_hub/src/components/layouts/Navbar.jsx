import React from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";
import { useState } from "react";

import LOGO from "../../assets/logo.svg";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
      {/* Gradient accent line */}
      <div className="h-1 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>

      <div className="flex items-center justify-between gap-5 py-4 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Left section - Menu & Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            className="block lg:hidden text-gray-700 hover:text-purple-600 transition-colors duration-300 p-2 hover:bg-purple-50 rounded-lg"
            onClick={() => setOpenSideMenu(!openSideMenu)}
            aria-label="Toggle menu"
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl transition-transform duration-300 rotate-90" />
            ) : (
              <HiOutlineMenu className="text-2xl transition-transform duration-300 hover:scale-110" />
            )}
          </button>

          {/* Logo with hover effect */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-lg blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <img
                src={LOGO}
                alt="Logo"
                className="relative h-7 md:h-8 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Right section - Live indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="fixed top-[73px] left-0 w-full bg-white/98 backdrop-blur-lg border-b border-gray-200/60 shadow-2xl shadow-purple-100/20 lg:hidden z-40">
          <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
