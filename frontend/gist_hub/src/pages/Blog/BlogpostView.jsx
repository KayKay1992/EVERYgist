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
import { sanitizeMarkdown, calculateReadingTime } from "../../utils/helper";
import CommentInfo from "./components/CommentInfo";
import Drawer from "../../components/Drawer";
import LikeCommentButton from "./components/LikeCommentButton";
import RelatedPosts from "./components/RelatedPosts";
import TableOfContents from "./components/TableOfContents";
import LazyImage from "../../components/LazyImage";

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
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
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
        // Sort comments by newest first
        const sortedComments = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Error fetching comments by post ID:", error);
    }
  };

  //Generate Summary for Blog Post
  const generateBlogPostSummary = async () => {
    try {
      setErrorMsg("");
      setSummaryContent("");
      setOpenSummarizeDrawer(true);
      setIsSummaryLoading(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_POST_SUMMARY,
        {
          content: blogPostData.content || "",
        }
      );

      if (response.data) {
        setSummaryContent(response.data);
      } else {
        setErrorMsg("No summary generated. Please try again.");
      }
    } catch (error) {
      console.error("Error generating blog post summary:", error);
      setErrorMsg(
        error?.response?.data?.message ||
          error.message ||
          "Failed to generate summary. Please try again."
      );
    } finally {
      setIsSummaryLoading(false);
    }
  };

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
  const handleAddReply = async () => {
    try {
      // Validate comment
      if (!replyText || !replyText.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      // Make API call to add reply
      await axiosInstance.post(API_PATHS.COMMENTS.ADD(blogPostData._id), {
        content: replyText,
      });
      toast.success("Comment added successfully");
      setIsShowReplyForm(false);
      setReplyText("");
      fetchCommentByPostId(blogPostData._id);
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

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
                          {calculateReadingTime(blogPostData.content)} min read
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
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group max-h-[500px]">
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                      {blogPostData.coverImageUrl && (
                        <LazyImage
                          src={blogPostData.coverImageUrl}
                          alt={blogPostData.title}
                          className="relative w-full h-full max-h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                  </div>

                  <LikeCommentButton
                    postId={blogPostData._id || ""}
                    likes={blogPostData.likes || 0}
                    comments={comments?.length || 0}
                    post={{
                      id: blogPostData._id,
                      title: blogPostData.title,
                      slug: blogPostData.slug,
                      coverImageUrl: blogPostData.coverImageUrl,
                      tags: blogPostData.tags,
                    }}
                  />
                  {/* Table of Contents Sidebar - Takes 1/3 on large screens */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <TableOfContents content={blogPostData.content} />
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

                    <div className="relative z-10 blog-content">
                      <MarkdownContent
                        content={sanitizeMarkdown(blogPostData?.content || "")}
                      />
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                    <SharePost title={blogPostData.title} />
                  </div>

                  {/* Related Posts Section */}
                  <RelatedPosts
                    currentPostId={blogPostData._id}
                    tags={blogPostData.tags || []}
                  />

                  {/* Comments Section */}
                  <div className="mt-12 relative">
                    {/* Background Decoration */}
                    <div className="absolute -top-6 -left-6 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-pink-100/30 rounded-full blur-3xl"></div>

                    <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                      {/* Header with Gradient Accent */}
                      <div className="relative bg-linear-to-r from-purple-50 via-pink-50 to-rose-50 border-b border-gray-200 p-8">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="text-2xl font-bold text-gray-900">
                                  Discussion
                                </h4>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {comments?.length || 0}{" "}
                                  {comments?.length === 1
                                    ? "comment"
                                    : "comments"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <button
                            className="group flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                            onClick={() => {
                              if (!user) {
                                setOpenAuthForm(true);
                                return;
                              }
                              setIsShowReplyForm(true);
                            }}
                          >
                            <svg
                              className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span>Add Comment</span>
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="p-8">
                        {/* Reply Form */}
                        {isShowReplyForm && (
                          <div className="mb-8 bg-linear-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-6 border-2 border-dashed border-purple-200 animate-in slide-in-from-top duration-300">
                            <CommentReplyInput
                              user={user}
                              authorName={user.name}
                              content={""}
                              replyText={replyText}
                              setReplyText={setReplyText}
                              handleCancelReply={handleCancelReply}
                              handleAddReply={handleAddReply}
                              disableAutoGen
                              type="new"
                            />
                          </div>
                        )}

                        {/* Comments */}
                        {comments?.length > 0 ? (
                          <div className="space-y-6">
                            {comments.map((comment, index) => (
                              <div key={comment._id} className="relative">
                                {index > 0 && (
                                  <div className="absolute -top-3 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
                                )}
                                <CommentInfo
                                  commentId={comment._id || ""}
                                  authorName={comment.author.name}
                                  authorPhoto={comment.author.profileImageUrl}
                                  content={comment.content}
                                  updatedOn={
                                    comment.updatedAt
                                      ? moment(comment.updatedAt).format(
                                          "Do MMM YYYY"
                                        )
                                      : "-"
                                  }
                                  post={comment.post}
                                  replies={comment.replies || []}
                                  getAllComments={() =>
                                    fetchCommentByPostId(blogPostData._id)
                                  }
                                  onDelete={(commentId) =>
                                    setOpenDeleteAlert({
                                      open: true,
                                      data: commentId || comment._id,
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </div>
                            <h5 className="text-xl font-semibold text-gray-900 mb-2">
                              No comments yet
                            </h5>
                            <p className="text-gray-600 mb-6">
                              Be the first to share your thoughts!
                            </p>
                            <button
                              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                              onClick={() => {
                                if (!user) {
                                  setOpenAuthForm(true);
                                  return;
                                }
                                setIsShowReplyForm(true);
                              }}
                            >
                              Start the conversation
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Space */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
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

          <Drawer
            isOpen={openSummarizeDrawer}
            onClose={() => {
              setOpenSummarizeDrawer(false);
              setErrorMsg("");
            }}
            title={summaryContent?.title || blogPostData?.title}
          >
            {/* Loading State */}
            {isSummaryLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <LuSparkles className="text-purple-600 animate-spin text-xl" />
                  <p className="text-sm font-medium text-purple-700">
                    Generating AI summary...
                  </p>
                </div>
                <SkeletonLoader />
              </div>
            )}

            {/* Error State */}
            {!isSummaryLoading && errorMsg && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-3">
                  <LuCircleAlert
                    className="text-amber-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h6 className="font-semibold text-amber-900 mb-1">
                      Unable to generate summary
                    </h6>
                    <p className="text-sm text-amber-700">{errorMsg}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {!isSummaryLoading && !errorMsg && summaryContent && (
              <div className="space-y-6">
                {/* Summary Section */}
                {summaryContent?.summary && (
                  <div className="p-5 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h6 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
                      <LuSparkles className="text-base" />
                      Summary
                    </h6>
                    <p className="text-gray-700 leading-relaxed text-[15px]">
                      {summaryContent.summary}
                    </p>
                  </div>
                )}

                {/* What You Will Learn Section */}
                {summaryContent?.what_you_will_learn &&
                  summaryContent.what_you_will_learn.length > 0 && (
                    <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <h6 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-pink-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        What You'll Learn
                      </h6>
                      <ul className="space-y-3">
                        {summaryContent.what_you_will_learn.map(
                          (item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-gray-700 text-[15px]"
                            >
                              <span className="shrink-0 w-6 h-6 rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                                {index + 1}
                              </span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Fallback for plain string content */}
                {typeof summaryContent === "string" && (
                  <div className="prose prose-sm max-w-none">
                    <MarkdownContent content={summaryContent} />
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !errorMsg && !summaryContent && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <LuSparkles className="text-purple-500 text-3xl" />
                </div>
                <h6 className="text-lg font-semibold text-gray-900 mb-2">
                  No summary available
                </h6>
                <p className="text-sm text-gray-600">
                  Click the AI Summary button to generate a summary of this
                  post.
                </p>
              </div>
            )}
          </Drawer>
        </>
      )}
    </BlogLayout>
  );
};

export default BlogpostView;
