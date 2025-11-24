const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserComments,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { optimizeImage } = require("../utils/imageOptimizer");
const multer = require("multer");

const router = express.Router();

//Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);
router.get("/my-comments", protect, getUserComments);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Optimize the uploaded image
    const optimizationResults = await optimizeImage(req.file.path);

    // Return URLs for all image variants
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const getRelativePath = (fullPath) =>
      fullPath.replace(/\\/g, "/").split("uploads/")[1];

    res.status(200).json({
      imageUrl: `${baseUrl}/uploads/${getRelativePath(
        optimizationResults.optimized
      )}`,
      original: `${baseUrl}/uploads/${getRelativePath(
        optimizationResults.original
      )}`,
      webp: `${baseUrl}/uploads/${getRelativePath(optimizationResults.webp)}`,
      thumbnail: `${baseUrl}/uploads/${getRelativePath(
        optimizationResults.thumbnail
      )}`,
      thumbnailWebp: `${baseUrl}/uploads/${getRelativePath(
        optimizationResults.thumbnailWebp
      )}`,
      metadata: optimizationResults.metadata,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({
      message: "Error processing image",
      error: error.message,
    });
  }
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
