import React from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuLoaderCircle, LuGalleryVerticalEnd } from "react-icons/lu";
import FeaturedBlogPost from "./components/FeaturedBlogPost";
import BlogPostSummary from "./components/BlogPostSummary";
import TrendingPostsSection from "./components/TrendingPostsSection";

const BlogLandingPage = () => {
  const navigate = useNavigate();

  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  //initial fetch
  useEffect(() => {
    getAllPosts(1);
  }, []);

  const handleClickPost = (post) => {
    navigate(`/${post.slug}`);
  };
  return (
    <BlogLayout>
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
                updatedOn={blogPostList[0].updatedAt ? moment(blogPostList[0].updatedAt).format("MMM D, YYYY") : "-"}
                authorName={blogPostList[0].author.name}
                authorProfileImg={blogPostList[0].author.profileImageUrl}
                onClick={() => handleClickPost(blogPostList[0])}
              />
            </div>
          )}

          {/* Other Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {blogPostList.length > 0 && blogPostList.slice(1).map((item) => (
              <BlogPostSummary
                key={item._id}
                post={item._id}
                title={item.title}
                coverImageUrl={item.coverImageUrl}
                description={item.content}
                tags={item.tags}
                authorName={item.author.name}
                authorProfileImg={item.author.profileImageUrl}
                updatedOn={item.updatedAt ? moment(item.updatedAt).format("MMM D, YYYY") : "-"}
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

          {/* Load More Button */}
          {page < totalPages && (
            <div className="flex items-center justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-[15px]" />
                ) : (
                  <LuGalleryVerticalEnd className="text-lg" />
                )}{" "}
                {isLoading ? "Loading..." : "Load More Posts"}
              </button>
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
