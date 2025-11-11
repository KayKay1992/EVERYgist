import React from 'react'
import {HiOutlineMenu, HiOutlineX} from "react-icons/hi";
import SideMenu from './SideMenu';
import { useState } from 'react';

import LOGO from "../../assets/logo.svg";

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
   <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 ">
    <button
      className='block lg:hidden text-black -mt-1'
      onClick={() => setOpenSideMenu(!openSideMenu)}
    >
      {openSideMenu ? <HiOutlineX className="text-2xl cursor-pointer" /> : <HiOutlineMenu className="text-2xl cursor-pointer" />}
    </button>

    <img src={LOGO} alt="Logo" className="h-6 md:h-[26px]"/>

    {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white border border-gray-200/50 shadow-lg">
            <SideMenu activeMenu={activeMenu} setOpenSideMenu={setOpenSideMenu} />
        </div>
    )}
  </div>
)

}

export default Navbar