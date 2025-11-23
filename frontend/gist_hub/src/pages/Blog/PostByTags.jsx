import React from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import BlogPostSummary from "./components/BlogPostSummary";
import moment from "moment";
import TrendingPostsSection from "./components/TrendingPostsSection";
import { LuTag, LuSearch, LuBookmark } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../utils/data";

const PostByTags = () => {
  const { tagName } = useParams();
  const navigate = useNavigate();
  const [blogPostList, setBlogPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //fetch Blog post By Tag
  const fetchPostByTag = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_TAG(tagName)
      );

      setBlogPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  useEffect(() => {
    fetchPostByTag();
    return () => {};
  }, [tagName]);

  // Find the active menu item based on current tag
  const activeMenuItem = BLOG_NAVBAR_DATA.find(
    (item) => item.path === `/tag/${tagName}`
  );
  const activeMenuId = activeMenuItem?.id;

  return (
    <BlogLayout activeMenu={activeMenuId}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/20 to-pink-50/20">
        {/* Hero Section with Tag Header */}
        <div className="relative overflow-hidden bg-white border-b border-gray-200">
          {/* Gradient Background Effect */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 via-pink-600/5 to-rose-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
            {/* Tag Badge */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-purple-100 to-pink-100 rounded-full border-2 border-purple-200 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                  <LuTag className="text-white text-lg" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Topic
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                    #{tagName}
                  </h1>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center">
              <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
                <LuSearch className="text-purple-600" />
                <span>
                  Found{" "}
                  <span className="font-bold text-purple-600">
                    {blogPostList.length}
                  </span>{" "}
                  {blogPostList.length === 1 ? "post" : "posts"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Posts List - Takes 2/3 */}
            <div className="lg:col-span-2">
              {/* Loading State */}
              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
                    >
                      <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts List */}
              {!isLoading && blogPostList.length > 0 && (
                <div className="space-y-8">
                  {/* Section Header */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-linear-to-r from-purple-200 to-pink-200">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                        <LuBookmark className="text-white text-sm" />
                      </span>
                      All Posts
                    </h2>
                    <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                      {blogPostList.length}{" "}
                      {blogPostList.length === 1 ? "Article" : "Articles"}
                    </span>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPostList.map((item, index) => (
                      <div key={item._id} onClick={() => handleClick(item)}>
                        <BlogPostSummary
                          title={item.title}
                          coverImageUrl={item.coverImageUrl}
                          description={item.content}
                          tags={item.tags}
                          updatedOn={
                            item.updatedAt
                              ? moment(item.updatedAt).format("Do MMM YYYY")
                              : "-"
                          }
                          authorName={item.author?.name}
                          authorProfileImg={item.author?.profileImageUrl}
                          onClick={() => handleClick(item)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && blogPostList.length === 0 && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    {/* Empty Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <LuSearch className="text-purple-400 text-4xl" />
                    </div>

                    {/* Message */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No posts found
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      We couldn't find any posts tagged with{" "}
                      <span className="font-bold text-purple-600">
                        #{tagName}
                      </span>
                      .
                      <br />
                      Try exploring other topics or check back later!
                    </p>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate("/blog")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <LuBookmark className="text-lg" />
                      <span>Browse All Posts</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Takes 1/3 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Trending Posts Card */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                    <TrendingPostsSection />
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LuTag className="text-purple-600" />
                    About This Tag
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Discover articles and insights related to{" "}
                    <span className="font-semibold text-purple-600">
                      #{tagName}
                    </span>
                    . Stay updated with the latest content and discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default PostByTags;
