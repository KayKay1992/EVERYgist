import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100/50 p-2">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`group relative flex-1 px-4 md:px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === tab.label
                ? "bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm md:text-base">{tab.label}</span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                  activeTab === tab.label
                    ? "bg-white/20 text-white"
                    : "bg-purple-100 text-purple-700 group-hover:bg-purple-200"
                }`}
              >
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
