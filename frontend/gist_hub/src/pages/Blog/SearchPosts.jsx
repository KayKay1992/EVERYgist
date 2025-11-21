import React, { useEffect, useState } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import BlogPostSummary from "./components/BlogPostSummary";
import TrendingPostsSection from "./components/TrendingPostsSection";
import { LuSearch, LuFileText, LuSparkles } from "react-icons/lu";

const SearchPosts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query");

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
        params: { q: query },
      });
      if (response.data) {
        setSearchResults(response.data || []);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //handle post click
  const handleClick = (post) => {
    navigate(`/${post.slug}`);
  };

  //on mount, perform search
  useEffect(() => {
    handleSearch();
    return () => {};
  }, [query]);
  return (
    <BlogLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white border-b border-gray-200 mb-12">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 via-pink-600/5 to-rose-600/5"></div>

          {/* Floating Blur Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center space-y-6">
              {/* Search Icon Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-100 to-pink-100 mb-4">
                <LuSearch className="text-purple-600 text-3xl" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Search Results
              </h1>

              {/* Query Display */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border-2 border-purple-200 shadow-lg">
                <LuSparkles className="text-purple-600" />
                <span className="text-gray-600">Showing results for</span>
                <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                  "{query}"
                </span>
              </div>

              {/* Results Count */}
              {!isLoading && (
                <p className="text-gray-600">
                  Found{" "}
                  <span className="font-bold text-purple-600">
                    {searchResults.length}
                  </span>{" "}
                  {searchResults.length === 1 ? "article" : "articles"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Search Results - 2/3 width */}
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

              {/* Results */}
              {!isLoading && searchResults.length > 0 && (
                <div className="space-y-8">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-linear-to-r from-purple-200 to-pink-200">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <LuFileText className="text-white text-sm" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      All Results
                    </h2>
                  </div>

                  {/* Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResults.map((item, index) => (
                      <div
                        key={item._id}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                          opacity: 0,
                        }}
                        onClick={() => handleClick(item)}
                      >
                        <BlogPostSummary
                          post={item}
                          title={item.title}
                          coverImageUrl={item.coverImageUrl}
                          description={item.content}
                          tags={item.tags}
                          updatedOn={
                            item.updatedAt
                              ? moment(item.updatedAt).format("Do MMM YYYY")
                              : "-"
                          }
                          authorName={item.author.name}
                          authorProfileImg={item.author.profileImageUrl}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && searchResults.length === 0 && (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <LuSearch className="text-purple-400 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      We couldn't find any posts matching
                      <span className="font-bold text-purple-600">
                        {" "}
                        "{query}"
                      </span>
                      .
                      <br />
                      Try different keywords or browse all posts!
                    </p>
                    <button
                      onClick={() => navigate("/blog")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <LuFileText className="text-lg" />
                      <span>Browse All Posts</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                    <TrendingPostsSection />
                  </div>
                </div>

                {/* Search Tips Card */}
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <LuSparkles className="text-purple-600" />
                    Search Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span>Use specific keywords for better results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span>Try different word variations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-0.5">•</span>
                      <span>Browse by tags for related content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </BlogLayout>
  );
};

export default SearchPosts;
