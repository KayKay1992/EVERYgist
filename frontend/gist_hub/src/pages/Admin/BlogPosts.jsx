import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { LuGalleryVerticalEnd, LuLoaderCircle, LuPlus } from "react-icons/lu";
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
        <div className="flex items-center justify-between ">
          <h2 className="text-2xl font-semibold mt-5 mb-5">Blog Posts</h2>

          <button
            className="btn-small"
            onClick={() => navigate("/admin/create")}
          >
            <LuPlus className="inline-block mr-2 text-[18px]" />
            Create New Post
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={filterStatus}
          setActiveTab={setFilterStatus}
        />

        <div className="mt-5">
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

          {page < totalPages && (
            <div className="flex items-center justify-center mb-8">
              <button
                className="flex items-center gap-3 text-sm text-white font-medium bg-black px-7 py-2 rounded-md hover:bg-gray-900 text-nowrap disabled:bg-gray-400 cursor-pointer hover:scale-105 transition-all"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LuLoaderCircle className="animate-spin text-2xl text-amber-700" />
                ) : (
                  <LuGalleryVerticalEnd className="text-2xl" />
                )}{" "}
                {isLoading ? "Loading..." : "Load More Posts"}
              </button>
            </div>
          )}
        </div>
      </div>
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
