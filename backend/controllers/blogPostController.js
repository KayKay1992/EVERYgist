const BlogPost = require("../models/BlogPost");
const mongoose = require("mongoose");

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Admin
const createPost = async (req, res) => {
  try {
    const { title, content, tags, coverImageUrl, isDraft, generatedByAI } =
      req.body;

    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const newPost = new BlogPost({
      title,
      content,
      tags,
      coverImageUrl,
      isDraft,
      generatedByAI,
      slug,
      author: req.user._id,
    });

    await newPost.save();

    res.status(201).json({ newPost });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: err.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Admin
const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorised to update this post." });
    }

    const updatedData = req.body;
    if (updatedData.title) {
      updatedData.slug = updatedData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update post", error: err.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Admin
const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get all blog posts by status (all, published, draft) and include counts
// @route   GET /api/posts?status=published|draft|all&page=1
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const rawStatus = req.query.status ?? "published";
      const status = String(rawStatus).trim().toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    //determine filter for main post response
    const filter = {};
      if (status === "all") {
        // no filter
      } else if (status === "published" || status.startsWith("pub")) {
        filter.isDraft = false;
      } else if (status === "draft" || status.startsWith("draft") || status.includes("draft")) {
        filter.isDraft = true;
      } else {
        // unknown status -> respond with 400 to avoid misleading results
        return res.status(400).json({ message: "Invalid status value. Use one of: published, draft, all." });
      }

    //fetch paginated posts
    const posts = await BlogPost.find(filter)
      .populate("author", "name profileImageUrl")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    //count totals for pagination and tab counts
    const [totalCount, allCount, publishedCount, draftCount] =
      await Promise.all([
        BlogPost.countDocuments(filter), // for pagination of current tab.
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true }),
      ]);

    res.json({
      posts,
      page,
      totalPage: Math.ceil(totalCount / limit),
      totalCount,
      counts: {
        all: allCount,
        published: publishedCount,
        draft: draftCount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get a post by slug
// @route   GET /api/posts/slug/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
      "author",
      "name profileImageUrl"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
const getPostsByTag = async (req, res) => {
  try {
    const posts = await BlogPost.find({ tags: req.params.tag, isDraft: false })
        .populate("author", "name profileImageUrl")
        .sort({ createdAt: -1 });
    res.json(posts);

  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// @desc    Search posts by title and content
// @route   GET /api/posts/search?q=keyword
// @access  Public
const searchPosts = async (req, res) => {
  try {
    const q = req.query.q;
    const posts = await BlogPost.find({
      isDraft: false,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    })
      .populate("author", "name profileImageUrl")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @desc    Increment view count
// @route   PUT /api/posts/:id/view
// @access  Public
const incrementView = async (req, res) => {
  try {
       await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json({message: "View count incremented"});
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

 

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Protected
const likePost = async (req, res) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, {
        $inc: {likes: 1}
    });
    res.json({message: 'Like added'})
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


// @desc    Top trending
// @route   GET /api/posts/trending
// @access  Public
const getTopPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ isDraft: false })
      .populate("author", "name profileImageUrl")
      .sort({ views: -1, likes: -1 })
      .limit(5);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

module.exports = {
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
};
