const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");

// @desc    Get dashboard summary
// @route   GET /api/dashboard-summary
// @access  Private (Admin)
const getDashboardSummary = async (req, res) => {
  try {
    //basic counts
    const [totalPosts, published, drafts, totalComments, aiGenerated] =
      await Promise.all([
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true }),
        Comment.countDocuments(),
        BlogPost.countDocuments({ generatedByAI: true }),
      ]);

    const totalViewsAgg = await BlogPost.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$views" },
        },
      },
    ]);
    const totalLikesAgg = await BlogPost.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$likes" },
        },
      },
    ]);
    const totalViews = totalViewsAgg[0]?.total || 0;
    const totalLikes = totalLikesAgg[0]?.total || 0;

    //Top perfiorming posts
    const topPosts = await BlogPost.find({ isDraft: false })
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .select("title coverImageUrl views likes");

    //Recent comments
    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name profileImageUrl")
      .populate("post", "title coverImageUrl");

    //Tag usage stats
    const tagUsage = await BlogPost.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $project: { tag: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      stats: {
        totalPosts,
        published,
        drafts,
        totalComments,
        aiGenerated,
        totalViews,
        totalLikes,
      },
      topPosts,
      recentComments,
      tagUsage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve dashboard summary",
      error: error.message,
    });
  }
};

module.exports = { getDashboardSummary };
