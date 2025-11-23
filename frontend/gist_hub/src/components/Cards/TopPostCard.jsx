import React from "react";
import { LuHeart, LuEye, LuTrendingUp } from "react-icons/lu";

const TopPostCard = ({ title, views, coverImageUrl, likes, maxViews }) => {
  const viewPercentage = ((views / maxViews) * 100).toFixed(0);

  return (
    <div className="group relative bg-linear-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl shadow-lg border border-purple-100/50 hover:shadow-xl hover:shadow-purple-200/40 transition-all duration-300 overflow-hidden">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none"></div>

      <div className="relative p-4 flex flex-col gap-3">
        {/* Image and Title */}
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-xl ring-2 ring-purple-200/50 group-hover:ring-purple-400/50 transition-all">
            {coverImageUrl && (
              <img
                src={coverImageUrl}
                alt={title}
                className="w-14 h-14 object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
            {/* Trending badge */}
            <div className="absolute top-1 right-1 bg-linear-to-br from-purple-600 to-pink-600 rounded-full p-1">
              <LuTrendingUp className="text-white text-xs" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-700 group-hover:to-pink-700 group-hover:bg-clip-text transition-all">
              {title}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2.5 bg-linear-to-r from-purple-100 to-pink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 rounded-full transition-all duration-500 relative"
            style={{ width: `${viewPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg">
            <LuEye className="text-blue-600 text-sm" />
            <span className="text-sm font-bold text-blue-700">{views}</span>
            <span className="text-xs text-blue-600">views</span>
          </div>

          <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-lg">
            <LuHeart className="text-pink-600 text-sm" />
            <span className="text-sm font-bold text-pink-700">{likes}</span>
            <span className="text-xs text-pink-600">likes</span>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="flex items-center justify-center pt-2 border-t border-purple-100/50">
          <span className="text-xs font-semibold text-purple-600">
            {viewPercentage}% of top performer
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopPostCard;
