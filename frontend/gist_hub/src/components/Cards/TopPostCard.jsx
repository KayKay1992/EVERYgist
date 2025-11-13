import React from "react";
import { LuHeart } from "react-icons/lu";

const TopPostCard = ({ title, views, coverImageUrl, likes, maxViews }) => {
  // const viewPercentage = maxViews ? Math.min((views / maxViews) * 100, 100) : 0;
  const viewPercentage = ((views / maxViews) * 100).toFixed(0);
  return (
    <div className="bg-white py-4 px-3 mb-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
      <div className="flex flex-start gap-2">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-10 h-10 rounded-md object-cover"
        />
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
      </div>
      <div className="relative w-full h-2 bg-sky-100/60 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-linear-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300" style={{ width: `${viewPercentage}%` }}></div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
        <span className="flex items-center gap-1 text-sm text-black">{views} Views</span>

        <span className="flex items-center gap-1 text-sm text-black">
          <LuHeart className="text-[10px] text-gray-500" />
          {likes} Likes
        </span>
      </div>
    </div>
  );
};

export default TopPostCard;
