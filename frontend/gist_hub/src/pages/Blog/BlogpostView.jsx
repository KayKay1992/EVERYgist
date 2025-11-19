import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { LuCircleAlert, LuDot, LuSparkles } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import CommentReplyInput from "../../components/Inputs/CommentReplyInput";
import toast from "react-hot-toast";
import TrendingPostsSection from "./components/TrendingPostsSection";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import MarkdownContent from "./components/MarkdownContent";
import SharePost from "./components/SharePost";
import { sanitizeMarkdown } from "../../utils/helper";

const BlogpostView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { user, setOpenAuthForm } = useContext(UserContext);

  const [blogPostData, setBlogPostData] = useState(null);
  const [comments, setComments] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);
  const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //Get Post Data by slug
  const fetchPostDetailsBySlug = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_SLUG(slug)
      );
      if (response.data) {
        const data = response.data;
        setBlogPostData(data);
        //fetch comments for the post
        fetchCommentByPostId(data._id);
        //increment views count
        incrementViews(data._id);
      }
    } catch (error) {
      console.error("Error fetching post details by slug:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Get Comments by Post ID
  const fetchCommentByPostId = async (postId) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMMENTS.GET_ALL_BY_POST(postId)
      );
      if (response.data) {
        const data = response.data;
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments by post ID:", error);
    }
  };

  //Generate Summary for Blog Post
  const generateBlogPostSummary = async () => {};

  //Increment Post Views
  const incrementViews = async (postId) => {
    if (!postId) return;
    try {
      const response = await axiosInstance.post(
        API_PATHS.POSTS.INCREMENT_VIEW(postId)
      );
    } catch (error) {
      console.error("Error incrementing post views:", error);
    }
  };

  //Handle cancelling a reply
  const handleCancelReply = () => {
    setReplyText("");
    setIsShowReplyForm(false);
  };

  //Add a reply
  const handleAddReply = async () => {};

  //on Mount
  useEffect(() => {
    fetchPostDetailsBySlug();
    return () => {};
  }, [slug]);

  return (
    <BlogLayout>
      {blogPostData && (
        <>
          <title>{blogPostData.title}</title>
          <meta name="description" content={blogPostData.title} />
          <meta property="og:title" content={blogPostData.title} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={blogPostData.coverImageUrl} />

          <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50/20 to-pink-50/20">
            {/* Hero Section with Side-by-Side Layout */}
            <div className="relative overflow-hidden bg-white border-b border-gray-200 shadow-sm">
              {/* Gradient Background Effect */}
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 via-pink-600/5 to-rose-600/5"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

              <div className="relative max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Hero Content - Takes 2/3 on large screens */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-pink-600 to-rose-600">
                      {blogPostData.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      {/* Date */}
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          {moment(blogPostData.updatedAt).format(
                            "MMMM Do, YYYY"
                          )}
                        </span>
                      </div>

                      <LuDot className="text-gray-400 text-xl hidden sm:block" />

                      {/* Reading Time */}
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md hover:border-pink-200 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">
                          {blogPostData.readingTime || 0} min read
                        </span>
                      </div>

                      <LuDot className="text-gray-400 text-xl hidden sm:block" />

                      {/* AI Summarize Button */}
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium group"
                        onClick={generateBlogPostSummary}
                      >
                        <LuSparkles className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                        <span>AI Summary</span>
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {blogPostData.tags.slice(0, 5).map((tag, index) => (
                        <button
                          key={index}
                          className="group px-4 py-2 bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md relative overflow-hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tag/${tag}`);
                          }}
                        >
                          <span className="relative z-10">#{tag}</span>
                          <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      ))}
                    </div>

                    {/* Cover Image */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                      <img
                        src={blogPostData.coverImageUrl || ""}
                        alt={blogPostData.title}
                        className="relative w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>

                  {/* Trending Posts Sidebar - Takes 1/3 on large screens */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                      {/* Trending Posts Card */}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                          <TrendingPostsSection />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Article Content */}
                <div className="lg:col-span-2">
                  {/* Content Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl z-0"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl z-0"></div>

                    <div className="relative z-10">
                      <MarkdownContent
                        content={sanitizeMarkdown(blogPostData?.content || "")}
                      />
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                    <SharePost title={blogPostData.title} />
                  </div>

                  {/* Comments Section Placeholder */}
                  <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-linear-to-b from-purple-600 to-pink-600 rounded-full"></div>
                      Comments
                    </h3>
                    <p className="text-gray-500">
                      Comments section coming soon...
                    </p>
                  </div>
                </div>

                {/* Sidebar Space */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-6">
                    {/* Author Card or Additional Info */}
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        About This Article
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>{blogPostData.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-pink-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span>{blogPostData.tags.length} tags</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </BlogLayout>
  );
};

export default BlogpostView;
