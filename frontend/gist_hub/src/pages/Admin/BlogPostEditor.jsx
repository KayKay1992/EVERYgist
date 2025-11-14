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
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate, useParams } from "react-router-dom";
import CoverImageSelector from "../../components/Inputs/CoverImageSelector";

const BlogPostEditor = ({ isEdit }) => {
  const navigate = useNavigate();
  const { postSlug } = useParams();
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    content: "",
    coverImageUrl: "",
    coverPreview: "",
    tags: "",
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
  const generatePostIdeas = async () => {};

  //Handle blog post publish
  const handlePublish = async (isDraft) => {};

  //Get Post data by slug
  const fetchPostDetailsBySlug = async () => {};

  //Delete blog post
  const deletePost = async () => {};

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
          <div className="form-card p-6 col-span-12 md:col-span-8 lg:col-span-9">
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
              <label className="text-xs font-medium text-slate-600">Content</label>

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
                  hideMenuBar={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogPostEditor;
