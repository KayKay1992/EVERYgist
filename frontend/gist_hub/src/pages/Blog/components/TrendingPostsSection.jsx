import React from "react";
import axiosInstance from "../../../utils/axioInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const TrendingPostsSection = () => {
  const navigate = useNavigate();

  const [postList, setPostList] = useState([]);

  //fetch trending posts
  const getTrendingPosts = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_TRENDING_POSTS
      );
      setPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.log("Error fetching trending posts:", error);
    }
  };

  //handle post click
  const handleClickPost = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    getTrendingPosts();
    return () => {};
  }, []);
  return (
    <div className="bg-linear-to-br from-white via-purple-50/30 to-pink-50/20 rounded-2xl p-6 border border-purple-100/50 shadow-xl shadow-purple-100/30 sticky top-24">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-linear-to-r from-transparent via-purple-200 to-transparent">
        <div className="relative">
          {/* Flame icon with gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-60"></div>
          <div className="relative bg-linear-to-br from-purple-600 via-pink-600 to-rose-600 p-2.5 rounded-full shadow-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold bg-linear-to-r from-purple-700 via-pink-700 to-purple-700 bg-clip-text text-transparent">
            Trending Now
          </h4>
          <p className="text-xs text-gray-500 font-medium">What's hot today</p>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {postList.length > 0 &&
          postList.map((item, index) => (
            <PostCard
              key={item._id}
              index={index}
              title={item.title}
              coverImageUrl={item.coverImageUrl}
              tags={item.tags}
              onClick={() => handleClickPost(item)}
            />
          ))}
      </div>

      {/* Empty State */}
      {postList.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No trending posts yet</p>
        </div>
      )}
    </div>
  );
};

export default TrendingPostsSection;

const PostCard = ({ index, title, coverImageUrl, tags, onClick }) => {
  return (
    <div
      className="group relative cursor-pointer p-3 rounded-xl bg-white/60 hover:bg-white border border-transparent hover:border-purple-200/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/40 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Ranking Badge */}
      <div className="absolute -left-2 -top-2 w-7 h-7 bg-linear-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-500/50 z-10">
        {index + 1}
      </div>

      {/* Tag Badge */}
      <div className="mb-2.5">
        <span className="inline-flex items-center gap-1 bg-linear-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200/50">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {tags[0]?.toUpperCase() || "TRENDING"}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex items-start gap-3">
        {/* Image with overlay effect */}
        <div className="relative shrink-0 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-300 z-10"></div>
          <img
            src={coverImageUrl}
            alt={title}
            className="w-16 h-16 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* View icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Title with gradient effect on hover */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold mb-1 line-clamp-3 text-gray-900 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-700 group-hover:to-pink-700 group-hover:bg-clip-text transition-all duration-300 leading-snug">
            {title}
          </h2>

          {/* Read More Indicator */}
          <div className="flex items-center gap-1 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-semibold">Read more</span>
            <svg
              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300"
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
