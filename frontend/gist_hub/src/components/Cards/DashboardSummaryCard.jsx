import React from 'react'

const DashboardSummaryCard = ({
    icon, value, bgColor, color, label
}) => {
  return <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm shadow-gray-100 border border-gray-200/50">
    <div className={`w-10 md:w-8 h-10 md:h-8 flex items-center justify-center rounded-sm ${bgColor} ${color} `}>
      {icon}
    </div>
    <p className="text-gray-500 font-semibold text-xs md:text-[14px]">
        <span className="text-sm md:text-[16px] text-black font-semibold">{value}</span> {" "}{label}
    </p>
  </div>
}

export default DashboardSummaryCard