import React from "react";
import { useNavigate } from "react-router-dom";

const BlogPostSummary = ({
  title,
  description,
  coverImageUrl,
  tags = [],
  updatedOn,
  authorName,
  authorProfileImg,
  onClick,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-purple-200/40 hover:-translate-y-2 border border-gray-100 hover:border-purple-200/60"
      onClick={onClick}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-pink-50/0 to-purple-50/0 group-hover:from-purple-50/30 group-hover:via-pink-50/20 group-hover:to-purple-50/30 transition-all duration-500 pointer-events-none z-0"></div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Read indicator badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 z-20">
          <svg
            className="w-3.5 h-3.5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-700">3 min</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative p-5 z-10">
        {/* Title */}
        <h2 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-pink-700 group-hover:bg-clip-text transition-all duration-300 leading-snug">
          {title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full hover:from-purple-100 hover:via-pink-100 hover:to-purple-100 transition-all duration-300 hover:scale-105 border border-purple-200/50 hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tag/${tag}`);
              }}
            >
              #{tag}
            </button>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-purple-600 font-medium">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Author Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-purple-100 transition-colors duration-300">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                src={authorProfileImg}
                alt={authorName}
                className="relative w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              {/* Online status dot */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {authorName}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {updatedOn}
              </p>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/50">
            <svg
              className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSummary;
