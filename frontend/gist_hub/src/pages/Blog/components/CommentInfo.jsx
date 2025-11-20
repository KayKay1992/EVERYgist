import React, { useContext, useState } from "react";
import moment from "moment";
import { LuChevronDown, LuTrash2, LuDot, LuReply } from "react-icons/lu";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
import CommentReplyInput from "../../../components/Inputs/CommentReplyInput";
import axiosInstance from "../../../utils/axioInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const CommentInfo = ({
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
  const { user, setOpenAuthForm } = useContext(UserContext);
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
      setShowSubReplies(true); // Show replies after adding
      getAllComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  return (
    <div className={`group ${isSubReply ? "ml-8 mt-4" : "mt-6"}`}>
      {/* Comment Card */}
      <div className="relative bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Gradient Accent on Hover */}
        <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="p-6">
          <div className="flex gap-4">
            {/* Avatar with Gradient Ring */}
            {authorPhoto && (
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-full ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all duration-300 overflow-hidden">
                  <img
                    src={authorPhoto}
                    alt={authorName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              {/* Author & Date */}
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-bold text-gray-900 text-base group-hover:text-purple-600 transition-colors duration-200">
                  {authorName}
                </h4>
                <LuDot className="text-gray-400 text-sm shrink-0" />
                <span className="text-sm text-gray-500 font-medium">
                  {updatedOn}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-gray-700 leading-relaxed mb-4 text-[15px]">
                {content}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {!isSubReply && (
                  <>
                    {/* Reply Button */}
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group/btn"
                      onClick={() => {
                        if (!user) {
                          console.log("User", user);
                          setOpenAuthForm(true);
                          return;
                        }
                        setShowReplyForm((prevState) => !prevState);
                      }}
                    >
                      <LuReply className="text-base group-hover/btn:rotate-12 transition-transform duration-200" />
                      <span>Reply</span>
                    </button>

                    {/* View Replies Button */}
                    {replies?.length > 0 && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                        onClick={() =>
                          setShowSubReplies((prevState) => !prevState)
                        }
                      >
                        <span className="flex items-center gap-1">
                          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold">
                            {replies?.length}
                          </span>
                          {replies?.length === 1 ? "Reply" : "Replies"}
                        </span>
                        <LuChevronDown
                          className={`text-base transition-transform duration-300 ${
                            showSubReplies ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {!isSubReply && showReplyForm && (
        <div className="mt-4 ml-12 animate-in slide-in-from-top duration-300">
          <CommentReplyInput
            user={user}
            authorName={authorName}
            content={content}
            replyText={replyText}
            setReplyText={setReplyText}
            handleCancelReply={handleCancelReply}
            handleAddReply={handleAddReply}
            disableAutoGen
          />
        </div>
      )}

      {/* Sub Replies */}
      {showSubReplies && replies?.length > 0 && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-300">
          {replies.map((comment, index) => (
            <div key={comment._id} className="relative">
              {/* Connection Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-200 via-pink-200 to-transparent"></div>

              <CommentInfo
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
                getAllComments={getAllComments}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentInfo;
