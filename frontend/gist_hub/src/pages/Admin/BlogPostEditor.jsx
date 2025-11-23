import React from "react";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import MDEditor, { commands } from "@uiw/react-md-editor";
import {
  LuLoaderCircle,
  LuSave,
  LuSend,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-hot-toast";
import { getToastMessageByType } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useParams } from "react-router-dom";
import CoverImageSelector from "../../components/Inputs/CoverImageSelector";
import TagInput from "../../components/Inputs/TagInput";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import BlogPostIdeaCard from "../../components/Cards/BlogPostIdeaCard";
import GenerateBlogPostForm from "./components/GenerateBlogPostForm";
import Modal from "../../components/Modal";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug } = useParams();
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: [],
    isDraft: "",
    generatedByAI: false,
  });
  const [postIdeas, setPostIdeas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openBlogPostGenForm, setOpenBlogPostGenForm] = useState({
    open: false,
    data: null,
  });
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  //Generate blog post ideas using AI
  const generatePostIdeas = async () => {
    setIdeaLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_BLOG_POST_IDEAS,
        {
          topics:
            "SPORTS, HEALTH, TECHNOLOGY, EDUCATION, POLITICS, TECHNOLOGY, LOCAL NEWS ",
        }
      );
      const generatedIdeas = aiResponse.data || [];
      if (generatedIdeas.length > 0) {
        setPostIdeas(generatedIdeas);
      }
    } catch (error) {
      console.error("Error generating post ideas:", error);
    } finally {
      setIdeaLoading(false);
    }
  };

  //Handle blog post publish
  const handlePublish = async (isDraft) => {
    let coverImageUrl = "";

    if (!postData.title.trim()) {
      setError("Post title is required.");
      return;
    }
    if (!postData.content.trim()) {
      setError("Post content is required.");
      return;
    }
    if (!isDraft) {
      if (!isEdit && !postData.coverImageUrl) {
        setError("Cover image is required for publishing post.");
        return;
      }
      if (isEdit && !postData.coverImageUrl && !postData.coverPreview) {
        setError("Cover image is required for publishing post.");
        return;
      }
      if (
        !postData.tags ||
        !Array.isArray(postData.tags) ||
        postData.tags.length === 0
      ) {
        setError("At least one tag is required for publishing post.");
        return;
      }
    }
    setLoading(true);
    setError("");
    try {
      //check if a new image was uploaded (file type)
      if (postData.coverImageUrl instanceof File) {
        const imgUploadRes = await uploadImage(postData.coverImageUrl);
        coverImageUrl = imgUploadRes.imageUrl || "";
      } else {
        coverImageUrl = postData.coverPreview;
      }

      const reqPayload = {
        title: postData.title,
        content: postData.content,
        coverImageUrl,
        tags: postData.tags,
        isDraft: isDraft ? true : false,
        generatedByAI: true,
      };

      const response = isEdit
        ? await axiosInstance.put(
            API_PATHS.POSTS.UPDATE(postData.id),
            reqPayload
          )
        : await axiosInstance.post(API_PATHS.POSTS.CREATE_POST, reqPayload);

      if (response.data) {
        toast.success(
          getToastMessageByType(
            isDraft ? "draft" : isEdit ? "edit" : "published"
          )
        );
        navigate("/admin/posts");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to publish post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  //Get Post data by slug
  const fetchPostDetailsBySlug = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(postSlug)
      );
      if (response.data) {
        const data = response.data;
        setPostData((prevState) => ({
          ...prevState,
          id: data._id,
          title: data.title,
          content: data.content,
          coverPreview: data.coverImageUrl,
          tags: data.tags,
          isDraft: data.isDraft,
          generatedByAI: data.generatedByAI,
        }));
      }
    } catch (error) {
      console.error("Error fetching post details by slug:", error);
    }
  };

  //Delete blog post
  const deletePost = async () => {
    try {
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postData.id));
      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert(false);
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete blog post. Please try again.");
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchPostDetailsBySlug();
    } else {
      generatePostIdeas();
    }
    return () => {};
  }, [isEdit, postSlug]);

  return (
    <DashboardLayout activeMenu="Blog Posts">
      <div className="my-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 my-4">
          {/* Main Editor Section */}
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl border border-purple-100/50 overflow-hidden">
              {/* Header with Gradient */}
              <div className="bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {isEdit ? "Edit Post" : "Create New Post"}
                      </h2>
                      <p className="text-purple-100 text-sm font-medium">
                        {isEdit
                          ? "Update your content"
                          : "Share your thoughts with the world"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEdit && (
                      <button
                        className="group flex items-center gap-2 bg-white/10 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl border border-white/20 hover:border-rose-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        disabled={loading}
                        onClick={() => setOpenDeleteAlert(true)}
                      >
                        <LuTrash2 className="text-lg" />
                        <span className="hidden md:block">Delete</span>
                      </button>
                    )}

                    <button
                      className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                      disabled={loading}
                      onClick={() => handlePublish(true)}
                    >
                      <LuSave className="text-lg" />
                      <span className="hidden md:block">Save Draft</span>
                    </button>

                    <button
                      className="group flex items-center gap-2 bg-white text-purple-700 font-bold px-5 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      disabled={loading}
                      onClick={() => handlePublish(false)}
                    >
                      {loading ? (
                        <LuLoaderCircle className="animate-spin text-lg" />
                      ) : (
                        <LuSend className="text-lg" />
                      )}
                      <span>{isEdit ? "Update" : "Publish"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {error && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                    <p className="text-sm text-rose-600 font-medium flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                    </span>
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={postData.title}
                    onChange={({ target }) =>
                      handleValueChange("title", target.value)
                    }
                    className="w-full px-4 py-3 bg-purple-50/50 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="Enter an engaging title for your post..."
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="bg-pink-100 p-1 rounded">
                      <svg
                        className="w-4 h-4 text-pink-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Cover Image
                  </label>
                  <CoverImageSelector
                    image={postData.coverImageUrl}
                    setImage={(value) =>
                      handleValueChange("coverImageUrl", value)
                    }
                    preview={postData.coverPreview}
                    setPreview={(value) =>
                      handleValueChange("coverPreview", value)
                    }
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="bg-blue-100 p-1 rounded">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                          clipRule="evenodd"
                        />
                        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                      </svg>
                    </span>
                    Content
                  </label>

                  <div
                    data-color-mode="light"
                    className="rounded-xl overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all"
                  >
                    <MDEditor
                      value={postData.content}
                      onChange={(data) => handleValueChange("content", data)}
                      commands={[
                        commands.bold,
                        commands.italic,
                        commands.strikethrough,
                        commands.hr,
                        commands.quote,
                        commands.divider,
                        commands.link,
                        commands.code,
                        commands.image,
                        commands.unorderedListCommand,
                        commands.orderedListCommand,
                        commands.checkedListCommand,
                        commands.heading,
                        commands.heading1,
                        commands.heading2,
                        commands.heading3,
                        commands.heading4,
                        commands.heading5,
                        commands.heading6,
                      ]}
                      hideHeader={true}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Tags
                  </label>
                  <TagInput
                    tags={postData?.tags || []}
                    setTags={(data) => handleValueChange("tags", data)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/*AI Blog Post ideas section */}
          {!isEdit && (
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <div className="bg-white rounded-3xl shadow-xl border border-blue-100/50 overflow-hidden sticky top-24">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 via-cyan-600 to-blue-600 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                      <LuSparkles className="text-yellow-300 text-2xl animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        AI Post Ideas
                      </h4>
                      <p className="text-blue-100 text-sm font-medium">
                        Get inspired by AI
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    onClick={() =>
                      setOpenBlogPostGenForm({
                        open: true,
                        data: null,
                      })
                    }
                  >
                    <LuSparkles className="text-lg" />
                    Generate New Ideas
                  </button>
                </div>

                {/* Ideas List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {ideaLoading ? (
                    <div className="p-5">
                      <SkeletonLoader />
                    </div>
                  ) : (
                    postIdeas.map((idea, index) => (
                      <BlogPostIdeaCard
                        key={`idea_${index}`}
                        title={idea.title || ""}
                        description={idea.description || ""}
                        tags={idea.tags || []}
                        wordCount={idea.wordCount || ""}
                        tone={idea.tone || "casual"}
                        onSelect={() =>
                          setOpenBlogPostGenForm({
                            open: true,
                            data: idea,
                          })
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openBlogPostGenForm?.open}
        onClose={() => {
          setOpenBlogPostGenForm({
            open: false,
            data: null,
          });
        }}
        hideHeader
      >
        <GenerateBlogPostForm
          contentParams={openBlogPostGenForm?.data || null}
          setPostContent={(title, content) => {
            const postInfo = openBlogPostGenForm?.data || null;
            setPostData((prevState) => ({
              ...prevState,
              title: title || prevState.title,
              content: content,
              tags: postInfo?.tags || prevState.tags,
              generatedByAI: true,
            }));
          }}
          handleCloseForm={() => {
            setOpenBlogPostGenForm({
              open: false,
              data: null,
            });
          }}
        />
      </Modal>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Blog Post"
      >
        <div className="p-4 w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this blog post?"
            onDelete={() => deletePost()}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
