import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  LuGalleryVerticalEnd,
  LuLoaderCircle,
  LuPlus,
  LuSparkles,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import moment from "moment";
import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import Tabs from "../../components/Tabs";
import BlogPostSummaryCard from "../../components/Cards/BlogPostSummaryCard";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const BlogPosts = () => {
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [blogPostList, setBlogPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  //fetch all blog posts
  const getAllPosts = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.POSTS.GET_ALL, {
        params: {
          status: filterStatus.toLowerCase(),
          page: pageNumber,
        },
      });
      const { posts, totalPage, counts } = response.data;
      setBlogPostList((prevPosts) =>
        pageNumber === 1 ? posts : [...prevPosts, ...posts]
      );
      setTotalPages(totalPage);
      setPage(pageNumber);

      //Map statusSummary data with fixed labels and order.
      const statusSummary = counts || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Published", count: statusSummary.published || 0 },
        { label: "Draft", count: statusSummary.draft || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.log("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //delete blog post
  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postId));
      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert({ open: false, data: null });

      getAllPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  //Load more posts
  const handleLoadMore = () => {
    if (page < totalPages) {
      getAllPosts(page + 1);
    }
  };

  useEffect(() => {
    getAllPosts(1);
    return () => {};
  }, [filterStatus]);
  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="w-auto sm:max-w-[900px] mx-auto">
        {/* Header Section with Gradient */}
        <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl shadow-purple-500/30 p-8 mt-6 mb-6">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LuGalleryVerticalEnd className="text-yellow-300 text-3xl" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Blog Posts
                </h2>
              </div>
              <p className="text-purple-100 text-sm md:text-base font-medium">
                Manage and organize your content
              </p>
            </div>

            <button
              className="group flex items-center gap-2 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/admin/create")}
            >
              <div className="bg-purple-100 p-1.5 rounded-lg group-hover:bg-purple-200 transition-colors">
                <LuPlus className="text-xl" />
              </div>
              <span>Create New Post</span>
              <LuSparkles className="text-yellow-500" />
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-6">
          <Tabs
            tabs={tabs}
            activeTab={filterStatus}
            setActiveTab={setFilterStatus}
          />
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {blogPostList.map((post) => (
            <BlogPostSummaryCard
              key={post._id}
              title={post.title}
              imgUrl={post.coverImageUrl}
              updatedOn={
                post.updatedAt
                  ? moment(post.updatedAt).format("Do MMMM, YYYY")
                  : "-"
              }
              tags={post.tags}
              likes={post.likes}
              views={post.views}
              onClick={() => navigate(`/admin/edit/${post.slug}`)}
              onDelete={() =>
                setOpenDeleteAlert({ open: true, data: post._id })
              }
            />
          ))}

          {/* Load More Button */}
          {page < totalPages && (
            <div className="flex items-center justify-center py-8">
              <button
                className="group flex items-center gap-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LuLoaderCircle className="animate-spin text-2xl" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <LuGalleryVerticalEnd className="text-2xl" />
                    <span>Load More Posts</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && blogPostList.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <LuGalleryVerticalEnd className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 mb-6">
                {filterStatus === "All"
                  ? "Start creating your first blog post!"
                  : `No ${filterStatus.toLowerCase()} posts available.`}
              </p>
              <button
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 mx-auto"
                onClick={() => navigate("/admin/create")}
              >
                <LuPlus className="text-xl" />
                Create Your First Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Blog Post"
      >
        <div className="w-[70vw] md:w-[50vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this blog post?"
            onDelete={() => deletePost(openDeleteAlert?.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPosts;
