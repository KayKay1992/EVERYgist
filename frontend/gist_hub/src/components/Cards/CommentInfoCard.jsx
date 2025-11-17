import React, { useContext, useState } from "react";
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from "react-icons/lu";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import CommentReplyInput from "../Inputs/CommentReplyInput";

const CommentInfoCard = ({
  commentId,
  authorName,
  authorPhoto,
  content,
  updatedOn,
  post,
  replies,
  getAllComments,
  onDelete,
  isSubReply,
}) => {
  const { user } = useContext(UserContext);

  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showSubReplies, setShowSubReplies] = useState(false);

  //handle cancelling a reply
  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyText("");
  };

  //Add a reply
  const handleAddReply = async () => {
    try {
      // Validate reply text
      if (!replyText || !replyText.trim()) {
        toast.error("Reply cannot be empty");
        return;
      }

      // Get the post ID (should exist from the comment data)
      const postId = post?._id;
      if (!postId) {
        toast.error("Unable to add reply. Post information is missing.");
        return;
      }

      // Make API call to add reply
      const response = await axiosInstance.post(
        API_PATHS.COMMENTS.ADD(post._id),
        {
          content: replyText,
          parentComment: commentId,
        }
      );

      toast.success("Reply added successfully");
      setShowReplyForm(false);
      setReplyText("");
      getAllComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  return (
    <div
      className={`relative bg-white backdrop-blur-sm border border-gray-100 hover:border-sky-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden ${
        isSubReply ? "mb-2 p-3" : "mb-4 p-5"
      }`}
    >
      {/* Decorative gradient accent - appears on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-sky-50/0 via-sky-50/50 to-purple-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 lg:col-span-8 flex gap-4 order-2 md:order-1">
          <div className="flex items-start gap-3 w-full">
            {/* Enhanced Avatar with status ring */}
            <div className="relative shrink-0">
              <img
                src={authorPhoto}
                alt={authorName}
                className="w-12 h-12 rounded-full ring-2 ring-sky-100 group-hover:ring-sky-300 transition-all duration-300 object-cover shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-linear-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Author info with enhanced typography */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-[13px] text-gray-800 font-semibold hover:text-sky-600 transition-colors cursor-pointer">
                  @{authorName}
                </h3>
                <LuDot className="text-gray-300 shrink-0" />
                <span className="text-[12px] text-gray-400 font-medium">
                  {updatedOn}
                </span>
              </div>

              {/* Comment content with better readability */}
              <p className="text-[15px] text-gray-700 font-normal leading-relaxed mb-3">
                {content}
              </p>

              {/* Action buttons with modern styling */}
              <div className="flex items-center gap-2 flex-wrap">
                {!isSubReply && (
                  <>
                    <button
                      className="group/btn flex items-center gap-2 text-[13px] font-semibold text-sky-600 hover:text-white px-4 py-1.5 rounded-lg hover:bg-linear-to-r hover:from-sky-500 hover:to-sky-600 cursor-pointer border border-sky-200 hover:border-sky-500 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={() =>
                        setShowReplyForm((prevState) => !prevState)
                      }
                    >
                      <LuReply className="text-[14px] group-hover/btn:rotate-12 transition-transform" />
                      <span>Reply</span>
                    </button>
                    <button
                      className="group/btn flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-white px-4 py-1.5 rounded-lg bg-linear-to-r from-gray-50 to-gray-100 hover:from-sky-500 hover:to-sky-600 cursor-pointer border border-gray-200 hover:border-sky-500 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={() =>
                        setShowSubReplies((prevState) => !prevState)
                      }
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="font-bold">
                          {replies?.length || 0}
                        </span>
                        <span>
                          {replies?.length == 1 ? "reply" : "replies"}
                        </span>
                      </span>
                      <LuChevronDown
                        className={`text-[14px] transition-transform duration-300 ${
                          showSubReplies ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </>
                )}

                <button
                  className="group/btn flex items-center gap-2 text-[13px] font-semibold text-rose-600 hover:text-white px-4 py-1.5 rounded-lg hover:bg-linear-to-r hover:from-rose-500 hover:to-rose-600 cursor-pointer border border-rose-200 hover:border-rose-500 transition-all duration-200 hover:scale-105 hover:shadow-md ml-auto"
                  onClick={() => onDelete(commentId)}
                >
                  <LuTrash2 className="text-[14px] group-hover/btn:scale-110 transition-transform" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog post reference with enhanced visuals */}
        {!isSubReply && (
          <div className="col-span-12 md:col-span-6 lg:col-span-4 order-1 md:order-2 flex items-start gap-3 p-3 rounded-xl bg-linear-to-br from-gray-50 to-gray-100/50 border border-gray-100 hover:border-sky-200 transition-all duration-300 group/post hover:shadow-md">
            <img
              src={post?.coverImageUrl}
              alt="post cover"
              className="w-14 h-14 rounded-lg object-cover shadow-sm ring-2 ring-gray-100 group-hover/post:ring-sky-300 transition-all duration-300"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-bold mb-1 block">
                Post Reference
              </span>
              <h4 className="text-[13px] text-gray-700 font-semibold line-clamp-2 group-hover/post:text-sky-600 transition-colors leading-tight">
                {post?.title}
              </h4>
            </div>
          </div>
        )}
      </div>

      {/* Reply Input Form */}
      {!isSubReply && showReplyForm && (
        <CommentReplyInput
          user={user}
          authorName={authorName}
          content={content}
          replyText={replyText}
          setReplyText={setReplyText}
          handleAddReply={handleAddReply}
          handleCancelReply={handleCancelReply}
        />
      )}

      {/* Nested Replies with improved spacing */}
      {showSubReplies && replies?.length > 0 && (
        <div className="mt-5 ml-4 space-y-2 pl-4 border-l-2 border-gradient-to-b from-sky-200 via-sky-100 to-transparent">
          {replies.map((comment, index) => (
            <CommentInfoCard
              key={comment._id}
              commentId={comment._id}
              authorName={comment.author.name}
              authorPhoto={comment.author.profileImageUrl}
              content={comment.content}
              post={comment.post}
              replies={comment.replies || []}
              isSubReply
              updatedOn={
                comment.updatedAt
                  ? moment(comment.updatedAt).format("Do MMM YYYY")
                  : "-"
              }
              onDelete={() => onDelete(comment._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentInfoCard;
