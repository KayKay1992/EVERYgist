import React from "react";
import {
  LuEye,
  LuHeart,
  LuTrash2,
  LuCalendar,
  LuArrowRight,
} from "react-icons/lu";

const BlogPostSummaryCard = ({
  title,
  imgUrl,
  updatedOn,
  tags,
  likes,
  views,
  onClick,
  onDelete,
}) => {
  return (
    <div className="group relative bg-linear-to-br from-white via-purple-50/20 to-pink-50/20 rounded-2xl shadow-lg border border-purple-100/50 hover:border-purple-300/50 hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300 overflow-hidden">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 pointer-events-none"></div>

      <div
        className="relative flex items-start gap-4 p-4 cursor-pointer"
        onClick={onClick}
      >
        {/* Image with gradient border */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
          {imgUrl && (
            <img
              src={imgUrl}
              alt={title}
              className="relative w-20 h-20 rounded-xl object-cover ring-2 ring-purple-200/50 group-hover:ring-purple-400 group-hover:scale-105 transition-all duration-300"
            />
          )}
          {/* View indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all flex items-center justify-center">
            <LuArrowRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-700 group-hover:to-pink-700 group-hover:bg-clip-text transition-all">
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date */}
            <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
              <LuCalendar className="text-purple-600 text-sm" />
              <span className="text-xs font-semibold text-purple-700">
                {updatedOn}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                <LuEye className="text-blue-600 text-sm" />
                <span className="text-xs font-bold text-blue-700">{views}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-100">
                <LuHeart className="text-pink-600 text-sm" />
                <span className="text-xs font-bold text-pink-700">{likes}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <div
                className="flex items-center gap-1 text-xs font-semibold bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200/50"
                key={`tag_${index}`}
              >
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {tag}
              </div>
            ))}
            {tags.length > 3 && (
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          className="shrink-0 flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl border border-rose-200 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 className="text-lg" />
          <span className="hidden md:block">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default BlogPostSummaryCard;
