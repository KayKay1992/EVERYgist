const express = require("express");

const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
} = require("../controllers/blogPostController");
const { protect } = require("../middleware/authMiddleware");

//Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
//Blog Post Routes
router.post("/", protect, adminOnly, createPost);
router.get("/", getAllPosts);

router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

// Public routes
router.get("/slug/:slug", getPostBySlug);
router.get("/tag/:tag", getPostsByTag);
router.get("/search", searchPosts);

// Engagement routes
router.post("/:id/view", incrementView);
router.post("/:id/like", protect, likePost);

// Top posts
router.get("/trending", getTopPosts);

module.exports = router;
