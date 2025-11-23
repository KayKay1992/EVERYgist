import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab, onTabChange }) => {
  const handleTabClick = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    } else if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="flex gap-2 border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id || activeTab === tab.label;

        return (
          <button
            key={tab.id || tab.label}
            className={`group relative flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            }`}
            onClick={() => handleTabClick(tab.id || tab.label)}
          >
            {Icon && <Icon className="text-lg" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full transition-all ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 group-hover:bg-purple-100 group-hover:text-purple-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
