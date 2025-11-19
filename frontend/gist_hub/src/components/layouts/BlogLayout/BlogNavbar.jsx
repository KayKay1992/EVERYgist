import React, { useState } from "react";

import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../../utils/data";
import Logo from "../../../assets/logo.svg";
import SideMenu from "../SideMenu";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import ProfileInfoCard from "../../Cards/ProfileInfoCard";
import Login from "../../Auth/Login";
import SignUp from "../../Auth/SignUp";
import Modal from "../../Modal";

const BlogNavbar = ({ activeMenu }) => {
  const { user, setOpenAuthForm } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);

  console.log("BlogNavbar activeMenu:", activeMenu); // Debug log

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        {/* Gradient accent line */}
        <div className="h-1 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>

        <div className="container mx-auto flex items-center justify-between gap-5 py-4 px-6 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="block lg:hidden text-gray-700 hover:text-purple-600 transition-colors duration-300 p-2 hover:bg-purple-50 rounded-lg"
              onClick={() => {
                setOpenSideMenu(!openSideMenu);
              }}
              aria-label="Toggle menu"
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl transition-transform duration-300 rotate-90" />
              ) : (
                <HiOutlineMenu className="text-2xl transition-transform duration-300 hover:scale-110" />
              )}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-lg blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <img
                  src={Logo}
                  alt="logo"
                  className="relative h-7 md:h-8 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {BLOG_NAVBAR_DATA.map((item, index) => {
              if (item?.onlySideMenu) return;
              const isActive = activeMenu === item.id;
              console.log(
                `Item ${item.label}: id="${item.id}", activeMenu="${activeMenu}", isActive=${isActive}`
              ); // Debug
              return (
                <Link key={item.id} to={item.path}>
                  <li
                    className={`text-[15px] font-semibold list-none relative group cursor-pointer transition-colors duration-300 flex items-center gap-2 ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></div>
                    )}
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 bg-linear-to-r from-purple-600 to-pink-600 transition-transform duration-300 origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      } group-hover:scale-x-100`}
                    ></span>
                  </li>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 cursor-pointer"
              onClick={() => setOpenSearchBar(true)}
              aria-label="Search"
            >
              <LuSearch className="text-[22px]" />
            </button>

            {!user ? (
              <button
                className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                onClick={() => setOpenAuthForm(true)}
              >
                <span>Login/SignUp</span>
              </button>
            ) : (
              <div className="hidden md:block">
                <ProfileInfoCard />
              </div>
            )}
          </div>

          {openSideMenu && (
            <div className="fixed top-[73px] left-0 w-full bg-white/98 backdrop-blur-lg border-b border-gray-200/60 shadow-2xl shadow-purple-100/20 lg:hidden z-40">
              <SideMenu
                activeMenu={activeMenu}
                isBlogMenu
                setOpenSideMenu={setOpenSideMenu}
              />
            </div>
          )}
        </div>
      </div>

      <AuthModel />
    </>
  );
};

export default BlogNavbar;

const AuthModel = () => {
  const { openAuthForm, setOpenAuthForm } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      <Modal
        isOpen={openAuthForm}
        onClose={() => {
          setOpenAuthForm(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="">
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};
