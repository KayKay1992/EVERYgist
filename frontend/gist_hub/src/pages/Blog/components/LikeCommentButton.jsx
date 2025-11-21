import { LuMessageCircleDashed } from "react-icons/lu";
import { PiHandsClapping } from "react-icons/pi";
import axiosInstance from "../../../utils/axioInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import clsx from "clsx";
import { useState } from "react";

const LikeCommentButton = ({ likes, comments, postId }) => {
  const [postLikes, setPostLikes] = useState(likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLikeClick = async () => {
    if (!postId) return;

    try {
      const response = await axiosInstance.post(API_PATHS.POSTS.LIKE_POST(postId));
      if (response.data) {
        setPostLikes((prevState) => prevState + 1);
        setLiked(true);

        // reset animation after 500ms
        setTimeout(() => {
          setLiked(false);
        }, 100);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="flex flex-col gap-4">
        {/* Like Button */}
        <div className="relative group">
          {/* Animated Glow Effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-pink-600 via-rose-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition duration-500 group-hover:duration-300 animate-pulse"></div>

          <button
            className="relative flex items-center gap-3 px-6 py-4 bg-white backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-pink-200 transition-all duration-500 hover:scale-110 overflow-hidden group"
            onClick={handleLikeClick}
          >
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-linear-to-r from-pink-50 via-rose-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-pink-400 opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative flex items-center gap-3">
              <div
                className={clsx(
                  "relative transition-all duration-300",
                  liked && "animate-bounce"
                )}
              >
                <PiHandsClapping
                  className={clsx(
                    "text-3xl transition-all duration-500",
                    liked
                      ? "text-pink-500 scale-125 drop-shadow-lg"
                      : "text-gray-600 group-hover:text-pink-500 group-hover:scale-110"
                  )}
                />
                {/* Sparkle Effect on Like */}
                {liked && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                  </span>
                )}
              </div>
              <span
                className={clsx(
                  "text-xl font-bold transition-all duration-300",
                  liked
                    ? "text-pink-600"
                    : "text-gray-700 group-hover:text-pink-600"
                )}
              >
                {postLikes}
              </span>
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl transform -translate-x-2 group-hover:translate-x-0">
              <span className="flex items-center gap-2">❤️ Like this post</span>
              {/* Tooltip Arrow */}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-gray-900/95"></span>
            </span>
          </button>
        </div>

        {/* Decorative Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="h-px w-full bg-linear-to-r from-transparent via-purple-300 to-transparent"></div>
          <div className="absolute w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-pink-400 shadow-lg"></div>
        </div>

        {/* Comment Button */}
        <div className="relative group">
          {/* Animated Glow Effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-sky-600 via-blue-500 to-cyan-600 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition duration-500 group-hover:duration-300 animate-pulse"></div>

          <button className="relative flex items-center gap-3 px-6 py-4 bg-white backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-sky-200 transition-all duration-500 hover:scale-110 overflow-hidden group">
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-linear-to-r from-sky-50 via-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-sky-400 opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative flex items-center gap-3">
              <div className="relative">
                <LuMessageCircleDashed className="text-3xl text-gray-600 group-hover:text-sky-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                {/* Badge for comments count */}
                {comments > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-linear-to-r from-sky-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {comments > 99 ? "99+" : comments}
                  </span>
                )}
              </div>
              <span className="text-xl font-bold text-gray-700 group-hover:text-sky-600 transition-all duration-300">
                {comments}
              </span>
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl transform -translate-x-2 group-hover:translate-x-0">
              <span className="flex items-center gap-2">
                💬 View {comments} comment{comments !== 1 ? "s" : ""}
              </span>
              {/* Tooltip Arrow */}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-gray-900/95"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .group:hover {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LikeCommentButton;
