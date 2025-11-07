const express = require('express');
const {
    generateBlogPost,
    generatedBlogIdeas,
    generateCommentReply,
    generatePostSummary,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, generateBlogPost);
router.post('/generate-ideas', protect, generatedBlogIdeas);
router.post('/generate-reply', protect, generateCommentReply);
router.post('/generate-summary', protect, generatePostSummary);

module.exports = router;
