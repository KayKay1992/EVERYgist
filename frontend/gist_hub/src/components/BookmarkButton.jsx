import React, { useState, useEffect } from "react";
import { LuBookmark, LuBookmarkCheck } from "react-icons/lu";
import { isBookmarked, toggleBookmark } from "../utils/bookmarkUtils";
import toast from "react-hot-toast";

const BookmarkButton = ({ post, variant = "default" }) => {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(post.id));
  }, [post.id]);

  const handleBookmarkClick = (e) => {
    e.stopPropagation(); // Prevent parent onClick

    const newStatus = toggleBookmark(post);
    setBookmarked(newStatus);

    if (newStatus) {
      toast.success("Added to bookmarks!", {
        icon: "🔖",
        duration: 2000,
      });
    } else {
      toast.success("Removed from bookmarks", {
        icon: "✓",
        duration: 2000,
      });
    }
  };

  // Floating variant (for blog post view)
  if (variant === "floating") {
    return (
      <button
        onClick={handleBookmarkClick}
        className="group relative flex items-center gap-3 px-6 py-4 bg-white backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-amber-200 transition-all duration-500 hover:scale-110 overflow-hidden"
        title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
      >
        {/* Background Gradient on Hover */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-50 via-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-amber-400 opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-700"></div>

        <div className="relative flex items-center gap-3">
          {bookmarked ? (
            <LuBookmarkCheck className="text-3xl text-amber-600 transition-all duration-300" />
          ) : (
            <LuBookmark className="text-3xl text-gray-600 group-hover:text-amber-600 transition-all duration-500" />
          )}
        </div>

        {/* Tooltip */}
        <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl transform -translate-x-2 group-hover:translate-x-0">
          <span className="flex items-center gap-2">
            🔖 {bookmarked ? "Bookmarked" : "Bookmark"}
          </span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-gray-900/95"></span>
        </span>
      </button>
    );
  }

  // Icon only variant (for cards)
  if (variant === "icon") {
    return (
      <button
        onClick={handleBookmarkClick}
        className={`p-2 rounded-lg transition-all duration-300 ${
          bookmarked
            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
      >
        {bookmarked ? (
          <LuBookmarkCheck className="w-5 h-5" />
        ) : (
          <LuBookmark className="w-5 h-5" />
        )}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleBookmarkClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
        bookmarked
          ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300"
          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      {bookmarked ? (
        <LuBookmarkCheck className="w-5 h-5" />
      ) : (
        <LuBookmark className="w-5 h-5" />
      )}
      <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
    </button>
  );
};

export default BookmarkButton;
