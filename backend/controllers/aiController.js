const { GoogleGenAI } = require("@google/genai");
const {
  blogPostIdeasPrompt,
  generateReplyPrompt,
  postSummaryPrompt,
} = require("../utils/prompt");

const isProduction = process.env.NODE_ENV === "production";

function requireGoogleApiKey(res) {
  if (!process.env.GOOGLE_API_KEY) {
    res.status(503).json({
      message: "AI provider is not configured",
      error: "Missing GOOGLE_API_KEY",
    });
    return false;
  }
  return true;
}

async function extractGenAiText(response) {
  if (!response) return "";

  try {
    if (typeof response.text === "function") {
      const text = await response.text();
      return typeof text === "string" ? text : "";
    }

    if (typeof response.text === "string") return response.text;

    const parts =
      response?.candidates?.[0]?.content?.parts ||
      response?.response?.candidates?.[0]?.content?.parts ||
      [];
    const combined = parts
      .map((p) => (typeof p?.text === "string" ? p.text : ""))
      .join("");
    return combined;
  } catch {
    return "";
  }
}

function stripCodeFences(text) {
  if (!text) return "";
  return String(text)
    .replace(/^```[a-zA-Z]*\s*/m, "")
    .replace(/```\s*$/m, "")
    .trim();
}

function tryParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error };
  }
}

function extractJsonSubstring(text, kind) {
  if (!text) return "";
  const s = String(text);

  const open = kind === "array" ? "[" : "{";
  const close = kind === "array" ? "]" : "}";

  const start = s.indexOf(open);
  const end = s.lastIndexOf(close);
  if (start === -1 || end === -1 || end <= start) return "";
  return s.slice(start, end + 1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

//@desc    Generate Blog content based on topic
//@route   POST /api/ai/generate
//@access  Private
const generateBlogPost = async (req, res) => {
  try {
    if (!requireGoogleApiKey(res)) return;

    const { title, tone } = req.body;

    if (!title || !tone) {
      return res.status(400).json({ message: "Title and tone are required" });
    }

    const prompt = `Write a detailed blog post on the topic "${title}" in a "${tone}" tone. Include relevant subheadings, examples, and a conclusion. The content should be engaging and informative. Ensure it is well-structured and easy to read. include an introduction that hooks the reader. Use a variety of sentence structures to maintain interest. The blog post should be approximately 1500-2000 words long. markdown format with appropriate headings and subheadings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = await extractGenAiText(response);
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
    if (!requireGoogleApiKey(res)) return;

    const { topics } = req.body;

    if (!topics) {
      return res.status(400).json({ message: "Topics are required" });
    }
    const prompt = blogPostIdeasPrompt(topics);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = await extractGenAiText(response);
    const cleanedText = stripCodeFences(rawText);

    const direct = tryParseJson(cleanedText);
    if (!direct.ok) {
      const extracted = extractJsonSubstring(cleanedText, "array");
      const extractedParsed = extracted ? tryParseJson(extracted) : null;
      if (!extractedParsed?.ok) {
        return res.status(502).json({
          message: "AI provider returned invalid JSON",
          error: "Failed to parse blog ideas JSON",
          details: isProduction
            ? undefined
            : {
                parseError: String(direct.error?.message || direct.error),
                rawPreview: String(rawText || "").slice(0, 800),
              },
        });
      }

      return res.status(200).json(extractedParsed.value);
    }

    const ideas = direct.value;
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
    if (!requireGoogleApiKey(res)) return;

    const { author, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Comment is required" });
    }
    const prompt = generateReplyPrompt({ author, content });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = await extractGenAiText(response);
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
    if (!requireGoogleApiKey(res)) return;

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }
    const prompt = postSummaryPrompt(content);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = await extractGenAiText(response);
    const cleanedText = stripCodeFences(rawText);

    const direct = tryParseJson(cleanedText);
    if (!direct.ok) {
      const extracted = extractJsonSubstring(cleanedText, "object");
      const extractedParsed = extracted ? tryParseJson(extracted) : null;
      if (!extractedParsed?.ok) {
        return res.status(502).json({
          message: "AI provider returned invalid JSON",
          error: "Failed to parse post summary JSON",
          details: isProduction
            ? undefined
            : {
                parseError: String(direct.error?.message || direct.error),
                rawPreview: String(rawText || "").slice(0, 800),
              },
        });
      }
      return res.status(200).json(extractedParsed.value);
    }

    const data = direct.value;
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
