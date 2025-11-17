import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import CommentInfoCard from "../../components/Cards/CommentInfoCard";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Comments = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  //get all comment
  const getAllComments = async () => {
    //fetch comments from API
    try {
      const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL);
      setComments(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

   //delete comment
  const deleteComment = async (commentId) => {};

  //on mount
  useEffect(() => {
    getAllComments();
    return () => {};
  }, []);
  return  <DashboardLayout activeMenu="Comments">
    <div className="w-auto sm:max-w-[900px] mx-auto">
      <h2 className="text-2xl font-semibold mt-5 mb-5">Comments</h2>

      {comments.map((comment) => (
        <CommentInfoCard
          key={comment._id}
          commentId={comment._id}
          authorName={comment.author.name}
          authorPhoto={comment.author.profileImageUrl}
          content={comment.content}
          updatedOn={comment.updatedAt ? moment(comment.updatedAt).format("Do MMM YYYY") : "-"}
          post={comment.post}
          replies={comment.replies || []}
          getAllComments={getAllComments}
          onDelete={(commentId) =>
            setOpenDeleteAlert({
              open: true,
              data: commentId || comment._id,
            })
          }
       />
      ))}
    </div>
  </DashboardLayout>;
    
}

export default Comments;
