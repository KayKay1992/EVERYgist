import React from "react";
import { useState } from "react";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  LuLoaderCircle,
  LuReply,
  LuSend,
  LuWandSparkles,
} from "react-icons/lu";
import Input from "./Input";

const CommentReplyInput = ({
  user,
  authorName,
  content,
  replyText,
  setReplyText,
  handleAddReply,
  handleCancelReply,
  disableAutoGen,
  type = "reply",
}) => {
  const [loading, setLoading] = useState(false);

  //Generating reply using AI
  const generateReply = async () => {
    setLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_COMMENT_REPLY,
        {
          author: { name: authorName },
          content,
        }
      );
      const generatedReply = aiResponse.data;
      if (generatedReply?.length > 0) {
        setReplyText(generatedReply);
      }
    } catch (error) {
      console.error("Error generating AI reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 ml-10 relative">
      {/* Decorative reply line indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-sky-400 via-sky-300 to-transparent opacity-60"></div>

      <div className="pl-4 py-3 bg-linear-to-br from-sky-50/40 via-white to-sky-50/20 rounded-xl border border-sky-100/50 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex gap-3 items-start">
          {/* User Avatar with glow effect */}
          {user?.profileImageUrl && (
            <div className="relative">
              <img
                src={user.profileImageUrl}
                alt={user?.name}
                className="w-10 h-10 rounded-full ring-2 ring-sky-100 hover:ring-sky-300 transition-all duration-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          )}

          <div className="flex-1 space-y-3">
            {/* Input Field */}
            <div className="relative">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                label={type == "new" ? authorName : `Reply to @${authorName}`}
                placeholder={
                  type == "new"
                    ? "Share your thoughts... 💭"
                    : "Write your reply... 💬"
                }
                type="text"
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {/* AI Generate Button - Left Side */}
              {!disableAutoGen && (
                <button
                  className={`group flex items-center gap-2 text-[13px] font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-sky-600 px-4 py-2 rounded-lg hover:from-purple-700 hover:to-sky-700 transition-all duration-300 border-2 border-dashed border-purple-200 hover:border-purple-400 hover:scale-105 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-purple-100"
                  }`}
                  onClick={generateReply}
                  disabled={loading}
                >
                  {loading ? (
                    <LuLoaderCircle className="animate-spin text-[16px] text-purple-600" />
                  ) : (
                    <LuWandSparkles className="text-[16px] text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  <span className="hidden sm:inline">
                    {loading ? "Generating..." : "AI Generate"}
                  </span>
                </button>
              )}

              {/* Cancel & Submit Buttons - Right Side */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleCancelReply}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-800 bg-gray-50 px-5 py-2 rounded-lg hover:bg-gray-100 border border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 hover:scale-105"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className={`flex items-center gap-2 text-[13px] font-semibold text-white bg-linear-to-r from-sky-500 to-sky-600 px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                    replyText?.length == 0 || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-sky-600 hover:to-sky-700 hover:scale-105 hover:shadow-sky-200"
                  }`}
                  onClick={handleAddReply}
                  disabled={replyText?.length == 0 || loading}
                >
                  {type == "new" ? (
                    <LuSend className="text-[14px]" />
                  ) : (
                    <LuReply className="text-[16px]" />
                  )}
                  <span>{type == "new" ? "Post" : "Reply"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyInput;
