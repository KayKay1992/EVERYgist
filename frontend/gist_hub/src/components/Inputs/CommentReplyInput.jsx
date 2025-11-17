import React from "react";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuLoaderCircle, LuReply, LuSend, LuWandSparkles } from "react-icons/lu";
import Input from "./Input";

const CommentReplyInput = ({
  user,
  authorName,
  content,
  replyText,
  setReplyText,
  handleAddReply,
  handleCancelReply,
}) => {
  return <div>CommentReplyInput</div>;
};

export default CommentReplyInput;
