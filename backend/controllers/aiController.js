const { GoogleGenAI } = require("@google/genai");
const {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  postSummaryPrompt,
} = require("../utils/prompt");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

//@desc    Generate Blog content based on topic
//@route   POST /api/ai/generate
//@access  Private
const generateBlogPost = async (req, res) => {
  try {
    const { title, tone } = req.body;

    if (!title || !tone) {
      return res.status(400).json({ message: "Title and tone are required" });
    }

    const prompt = `Write a detailed blog post on the topic "${title}" in a "${tone}" tone. Include relevant subheadings, examples, and a conclusion. The content should be engaging and informative. Ensure it is well-structured and easy to read. include an introduction that hooks the reader. Use a variety of sentence structures to maintain interest. The blog post should be approximately 1500-2000 words long. markdown format with appropriate headings and subheadings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text || "";
    res.status(200).json(rawText);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate blog post", error: error.message });
  }
};

//@desc    Generate Blog Ideas based on topic
//@route   POST /api/ai/generate-ideas
//@access  Private
const generatedBlogIdeas = async (req, res) => {
  try {
    const { topics } = req.body;

    if (!topics) {
      return res.status(400).json({ message: "Topics are required" });
    }
    const prompt = blogPostIdeasPrompt(topics);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text || "";

    //clean text
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    //safe to parse
    const ideas = JSON.parse(cleanedText);
    res.status(200).json(ideas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to generate blog ideas", error: error.message });
  }
};

//@desc    Generate Reply for comment
//@route   POST /api/ai/generate-reply
//@access  Private
const generateCommentReply = async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const prompt = generateReplyPrompt({ author, content });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });
    let rawText = response.text || "";
    res.status(200).json(rawText);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate comment reply",
      error: error.message,
    });
  }
};

//@desc    Generate Post Summary
//@route   POST /api/ai/generate-summary
//@access  Private
const generatePostSummary = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }
    const prompt = postSummaryPrompt(content);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });
    let rawText = response.text || "";

    //clean and remove  ```json and ``` from beginning and end
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    //safe to parse
    const data = JSON.parse(cleanedText);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate post summary",
      error: error.message,
    });
  }
};

module.exports = {
  generateBlogPost,
  generatedBlogIdeas,
  generateCommentReply,
  generatePostSummary,
};
