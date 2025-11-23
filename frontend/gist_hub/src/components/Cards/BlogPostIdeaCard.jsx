import React from "react";
import { LuSparkles, LuTag, LuFileText } from "react-icons/lu";

const BlogPostIdeaCard = ({
  title,
  description,
  tags,
  tone,
  onSelect,
  wordCount,
}) => {
  return (
    <div
      className="group border-b border-blue-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-cyan-50 px-6 py-5 cursor-pointer transition-all duration-300 relative overflow-hidden"
      onClick={onSelect}
    >
      {/* Hover gradient accent */}
      <div className="absolute left-0 top-0 w-1 h-full bg-linear-to-b from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors flex-1 leading-relaxed">
          {title}
        </h3>
        <LuSparkles className="text-yellow-500 text-lg shrink-0 group-hover:animate-pulse" />
      </div>

      {/* Metadata badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg font-semibold border border-amber-200">
          <LuFileText className="text-xs" />
          {wordCount} words
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-lg font-semibold border border-purple-200 capitalize">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          </svg>
          {tone}
        </span>
      </div>

      <p className="text-xs font-medium text-gray-600 group-hover:text-gray-700 leading-relaxed mb-3">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        <LuTag className="text-blue-500 text-sm" />
        {tags.map((tag, index) => (
          <span
            key={`tag_${index}`}
            className="inline-flex items-center bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-200 hover:shadow-sm transition-shadow"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Click indicator */}
      <div className="mt-3 pt-3 border-t border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Click to use this idea
        </p>
      </div>
    </div>
  );
};

export default BlogPostIdeaCard;
