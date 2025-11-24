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

    // Cloudinary automatically handles optimization and returns the URL
    // req.file.path contains the Cloudinary URL
    const cloudinaryUrl = req.file.path;

    res.status(200).json({
      imageUrl: cloudinaryUrl, // Main optimized image URL
      original: cloudinaryUrl,
      webp: cloudinaryUrl, // Cloudinary auto-serves WebP when supported
      thumbnail: cloudinaryUrl, // Use transformations in frontend if needed
      thumbnailWebp: cloudinaryUrl,
      metadata: {
        width: req.file.width,
        height: req.file.height,
        format: req.file.format,
        size: req.file.size,
      },
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
