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
    try{
      await axiosInstance.delete(API_PATHS.POSTS.DELETE(postData.id));
      toast.success("Blog Post Deleted Successfully");
      setOpenDeleteAlert(false);
      navigate("/admin/posts");
    }catch (error) {
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 my-4">
          <div className="form-card p-6 col-span-12 md:col-span-8 lg:col-span-8">
            <div className="flex items-center justify-between ">
              <h2 className="text-base md:text-large font-medium">
                {isEdit ? "Edit Post" : "Add New Post"}
              </h2>
              <div className="flex items-center gap-3">
                {isEdit && (
                  <button
                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-rose-50 hover:border-rose-300 cursor-pointer hover:scale-[1.02] transition-all"
                    disabled={loading}
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className="text-sm" />{" "}
                    <span className="hidden md:block">Delete</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-2.5 text-[13px] text-sky-500 font-medium bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-100 hover:border-sky-400 cursor-pointer hover:scale-105 transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(true)}
                >
                  <LuSave className="text-sm" />{" "}
                  <span className="hidden md:block">Save as Draft</span>
                </button>

                <button
                  className="flex items-center gap-2.5 text-[13px] text-sky-600 font-medium bg-sky-50/60 rounded px-1.5 md:px-3 py-1 md:py-[3px] border border-sky-500 hover:bg-sky-50 cursor-pointer hover:scale-105 transition-all"
                  disabled={loading}
                  onClick={() => handlePublish(false)}
                >
                  {loading ? (
                    <LuLoaderCircle className="ansimate-spin text-[15px]" />
                  ) : (
                    <LuSend className="text-sm" />
                  )}
                  <span className="">
                    {isEdit ? "Update & Publish" : "Publish Post"}
                  </span>
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-600 pb-2.5">{error}</p>}

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">
                Post Title
              </label>
              <input
                type="text"
                value={postData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
                className="form-input"
                placeholder="Enter your blog post title"
              />
            </div>

            <div className="mt-4">
              <CoverImageSelector
                image={postData.coverImageUrl}
                setImage={(value) => handleValueChange("coverImageUrl", value)}
                preview={postData.coverPreview}
                setPreview={(value) => handleValueChange("coverPreview", value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Content
              </label>

              <div data-color-mode="light" className="mt-3">
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

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Tags</label>
              <TagInput
                tags={postData?.tags || []}
                setTags={(data) => handleValueChange("tags", data)}
              />
            </div>
          </div>

          {/*AI Blog Post ideas section */}
          {!isEdit && (
            <div className="form-card col-span-12 md:col-span-4 lg:col-span-4 p-0">
              <div className="flex items-center justify-between px-6 pt-6">
                <h4 className="text-sm md:text-base font-medium inline-flex items-center gap-2">
                  <span className="text-sky-600">
                    <LuSparkles />
                  </span>
                  Ideas for your next post
                </h4>

                <button
                  className="bg-linear-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-sky-800 text-white text-xs md:text-sm font-semibold transition-colors cursor-pointer px-3 py-1.5 rounded flex items-center gap-2 disabled:opacity-50 hover:shadow-2xl hover:shadow-sky-200"
                  onClick={() =>
                    setOpenBlogPostGenForm({
                      open: true,
                      data: null,
                    })
                  }
                >
                  Generate New
                </button>
              </div>

              <div className="">
                {ideaLoading ? (
                  <div className="p-5 ">
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
