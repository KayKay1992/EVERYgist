import React from "react";
import moment from "moment";
import { LuDot, LuMessageSquare, LuUser, LuClock } from "react-icons/lu";

const RecentCommentsList = ({ comments }) => {
  return (
    <div className="mt-4">
      <ul className="space-y-4">
        {comments?.slice(0, 10).map((comment, index) => (
          <li
            key={comment._id}
            className="group relative bg-linear-to-br from-white via-pink-50/20 to-rose-50/20 rounded-2xl p-4 border border-pink-100/50 hover:border-pink-300/50 hover:shadow-lg hover:shadow-pink-200/30 transition-all duration-300"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-pink-600/0 to-rose-600/0 group-hover:from-pink-600/5 group-hover:to-rose-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>

            {/* Index Badge */}
            <div className="absolute -top-2 -left-2 w-7 h-7 bg-linear-to-br from-pink-600 to-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
              {index + 1}
            </div>

            <div className="relative flex gap-4">
              {/* Avatar with ring */}
              <div className="shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-pink-500 to-rose-500 rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  {comment?.author?.profileImageUrl && (
                    <img
                      src={comment?.author?.profileImageUrl}
                      alt={comment?.author?.name}
                      className="relative w-12 h-12 rounded-full object-cover ring-2 ring-pink-200 group-hover:ring-pink-400 transition-all"
                    />
                  )}
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-pink-100 px-3 py-1 rounded-full">
                    <LuUser className="text-pink-600 text-xs" />
                    <p className="font-bold text-sm text-pink-700">
                      @{comment?.author?.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    <LuClock className="text-xs" />
                    <span className="text-xs font-medium">
                      {moment(comment.updatedAt).fromNow()}
                    </span>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="bg-white/60 rounded-xl p-3 mb-3 border border-pink-100/50">
                  <div className="flex items-start gap-2">
                    <LuMessageSquare className="text-pink-500 text-sm mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Post Reference */}
                <div className="flex items-center gap-3 bg-linear-to-r from-pink-50 to-rose-50 rounded-xl p-2.5 border border-pink-100/50 group-hover:shadow-md transition-all">
                  <div className="relative shrink-0">
                    {comment?.post?.coverImageUrl && (
                      <img
                        src={comment?.post?.coverImageUrl}
                        alt={comment?.post?.title}
                        className="w-11 h-11 rounded-lg object-cover ring-2 ring-pink-200/50"
                      />
                    )}
                    {/* Post icon overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 mb-0.5">
                      Commented on
                    </p>
                    <p className="text-sm text-gray-800 font-semibold line-clamp-1 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-pink-700 group-hover:to-rose-700 group-hover:bg-clip-text transition-all">
                      {comment.post?.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Empty State */}
      {(!comments || comments.length === 0) && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
            <LuMessageSquare className="w-10 h-10 text-pink-400" />
          </div>
          <p className="text-gray-500 font-medium">No comments yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Comments will appear here once readers engage
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentCommentsList;
