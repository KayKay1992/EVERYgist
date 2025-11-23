import React, { useEffect, useState } from "react";
import { LuSparkles, LuArrowRight } from "react-icons/lu";
import axiosInstance from "../../../utils/axioInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const RelatedPosts = ({ currentPostId, tags = [] }) => {
  const navigate = useNavigate();
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tags.length > 0) {
      fetchRelatedPosts();
    }
  }, [currentPostId, tags]);

  const fetchRelatedPosts = async () => {
    try {
      setIsLoading(true);
      // Fetch all published posts
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: "published",
          limit: 100,
        },
      });

      if (response.data?.posts) {
        // Filter posts that share at least one tag with the current post
        const filtered = response.data.posts
          .filter((post) => {
            // Exclude current post
            if (post._id === currentPostId) return false;

            // Check if post has any matching tags
            const hasMatchingTag = post.tags?.some((tag) => tags.includes(tag));
            return hasMatchingTag;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by newest first
          .slice(0, 3);

        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="relative bg-linear-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-gray-200 p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg animate-pulse">
              <LuSparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Related Articles
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="relative bg-linear-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-gray-200 p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <LuSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Related Articles
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              Continue your reading journey
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((post) => (
            <div
              key={post._id}
              onClick={() => {
                navigate(`/${post.slug}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group cursor-pointer bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Tags Badge */}
                {post.tags && post.tags.length > 0 && (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                      #{post.tags[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 line-clamp-2 mb-3">
                  {post.title}
                </h4>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    {post.author?.profileImageUrl && (
                      <img
                        src={post.author.profileImageUrl}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full ring-2 ring-white"
                      />
                    )}
                    <span className="font-medium">
                      {post.author?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="text-xs">
                    {post.updatedAt
                      ? moment(post.updatedAt).format("MMM D")
                      : ""}
                  </span>
                </div>

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-purple-600 group-hover:text-pink-600 font-semibold text-sm transition-colors duration-300">
                  <span>Read more</span>
                  <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedPosts;
