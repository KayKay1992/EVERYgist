const Comment = require("../models/Comment");
const BlogPost = require("../models/BlogPost");

// @desc    Add a comment to a blog post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    //ensure blog post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });
    await comment.populate("author", "name profileImageUrl");

    res.status(201).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// @desc    Get comments for a specific blog post
// @route   GET /api/comments/:postId
// @access  Public
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    //ensure blog post exists
    const comments = await Comment.find({ post: postId })
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: 1 }); //optional so replies comment in order
    //create a map for nested comments
    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject(); //convert from mongoose object to plain document
      comment.replies = []; // initialize replies array
      commentMap[comment._id] = comment;
    });

    // Nest replies under their parent comments
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve comments", error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment or an admin
    // if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Unauthorized to delete this comment" });
    // }

    //DELETE comment
    await comment.deleteOne({ _id: commentId });

    //delete all replies to this comment (one level of nesting only)
    await Comment.deleteMany({ parentComment: commentId });
    res
      .status(200)
      .json({ message: "Comment and its replies deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};

// @desc    Get all comments (for admin)
// @route   GET /api/comments
// @access  Private
const getAllComments = async (req, res) => {
  try {
    //fetch all comments with user and post details
    const comments = await Comment.find()
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: 1 });

    //create a map for nested comments
    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject(); //convert from mongoose object to plain document
      comment.replies = []; // initialize replies array
      commentMap[comment._id] = comment;
    });

    // Nest replies under their parent comments
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        nestedComments.push(commentMap[comment._id]);
      }
    });
    res.json(nestedComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve comments", error: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
};
