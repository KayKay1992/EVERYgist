import React from "react";
import { LuSparkles, LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[480px] lg:w-[520px] bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        tabIndex="-1"
        aria-labelledby="drawer-right-label"
        role="dialog"
        aria-modal="true"
      >
        {/* Gradient Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>

        {/* Header Section */}
        <div className="relative bg-linear-to-br from-purple-50/50 via-pink-50/30 to-white border-b border-gray-200 px-6 py-5">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100/30 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-100 to-pink-100 rounded-full">
                <LuSparkles className="text-purple-600 text-base animate-pulse" />
                <span className="text-xs font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                  AI SUMMARY
                </span>
              </div>

              {/* Title */}
              <h5
                id="drawer-right-label"
                className="text-xl md:text-2xl font-bold text-gray-900 leading-tight line-clamp-2"
              >
                {title}
              </h5>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="shrink-0 group p-2.5 rounded-xl bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-200 hover:shadow-md hover:scale-105"
              aria-label="Close drawer"
            >
              <LuX
                className="text-gray-600 group-hover:text-red-600 transition-colors"
                size={20}
              />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 custom-scrollbar">
          {/* Content Background Decoration */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-100/20 rounded-full blur-3xl -z-10"></div>

          <div className="relative space-y-4">{children}</div>
        </div>

        {/* Footer Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default Drawer;
