import React from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuLoaderCircle, LuGalleryVerticalEnd } from "react-icons/lu";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummary from "./components/BlogPostSummary";
import TrendingPostsSection from "./components/TrendingPostsSection";

const BlogLandingPage = () => {
  const navigate = useNavigate();
  const observerTarget = useRef(null);

  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);

  //fetch paginated blog posts
  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: "published",
          page: pageNumber,
        },
      });
      const { posts, totalPage } = response.data;
      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );
      setTotalPages(totalPage);
      setPage(pageNumber);
    } catch (error) {
      console.log("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //load more posts
  const handleLoadMore = () => {
    if (page < totalPages && !isLoading) {
      getAllPosts(page + 1);
    }
  };

  //initial fetch
  useEffect(() => {
    getAllPosts(1);
  }, []);

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !isLoading && page < totalPages) {
        getAllPosts(page + 1);
      }
    },
    [isLoading, page, totalPages]
  );

  useEffect(() => {
    if (!useInfiniteScroll) return;

    const element = observerTarget.current;
    const option = {
      root: null,
      rootMargin: "100px", // Start loading 100px before reaching the bottom
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver, useInfiniteScroll]);

  const handleClickPost = (post) => {
    navigate(`/${post.slug}`);
  };

  return (
    <BlogLayout activeMenu="01">
      {/* Infinite Scroll Toggle */}
      <div className="mb-6 flex items-center justify-end">
        <div className="inline-flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            Infinite Scroll
          </span>
          <button
            onClick={() => setUseInfiniteScroll(!useInfiniteScroll)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
              useInfiniteScroll ? "bg-blue-600" : "bg-gray-300"
            }`}
            role="switch"
            aria-checked={useInfiniteScroll}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                useInfiniteScroll ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Featured Blog Post */}
          {blogPostList.length > 0 && (
            <div className="mb-8">
              <FeaturedBlogPost
                title={blogPostList[0].title}
                description={blogPostList[0].content}
                coverImageUrl={blogPostList[0].coverImageUrl}
                tags={blogPostList[0].tags}
                updatedOn={
                  blogPostList[0].updatedAt
                    ? moment(blogPostList[0].updatedAt).format("MMM D, YYYY")
                    : "-"
                }
                authorName={blogPostList[0].author.name}
                authorProfileImg={blogPostList[0].author.profileImageUrl}
                onClick={() => handleClickPost(blogPostList[0])}
              />
            </div>
          )}

          {/* Other Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {blogPostList.length > 0 &&
              blogPostList
                .slice(1)
                .map((item) => (
                  <BlogPostSummary
                    key={item._id}
                    post={item._id}
                    title={item.title}
                    coverImageUrl={item.coverImageUrl}
                    description={item.content}
                    tags={item.tags}
                    authorName={item.author.name}
                    authorProfileImg={item.author.profileImageUrl}
                    updatedOn={
                      item.updatedAt
                        ? moment(item.updatedAt).format("MMM D, YYYY")
                        : "-"
                    }
                    onClick={() => handleClickPost(item)}
                  />
                ))}
          </div>

          {/* Loading State */}
          {isLoading && blogPostList.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <LuLoaderCircle className="animate-spin text-4xl text-blue-600" />
            </div>
          )}

          {/* No Posts State */}
          {!isLoading && blogPostList.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">No blog posts found</p>
            </div>
          )}

          {/* Infinite Scroll Loading Indicator */}
          {useInfiniteScroll && page < totalPages && (
            <div
              ref={observerTarget}
              className="flex items-center justify-center py-8"
            >
              {isLoading && (
                <div className="flex flex-col items-center gap-3">
                  <LuLoaderCircle className="animate-spin text-4xl text-blue-600" />
                  <p className="text-sm text-gray-600 font-medium">
                    Loading more posts...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Load More Button (when infinite scroll is off) */}
          {!useInfiniteScroll && page < totalPages && (
            <div className="flex items-center justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-lg" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}

          {/* End of Posts Message */}
          {page >= totalPages && blogPostList.length > 0 && (
            <div className="flex items-center justify-center mt-12 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200">
                  <span className="text-sm font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                    ✨ You've reached the end! All posts loaded.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Section Trending Posts */}
        <div className="col-span-12 md:col-span-3">
          <TrendingPostsSection />
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogLandingPage;
