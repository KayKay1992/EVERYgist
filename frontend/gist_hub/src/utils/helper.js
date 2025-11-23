export const getInitials = (title) => {
  if (!title) return "";

  const words = title.trim().split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0]; // ✅ use words[i], not words[1]
  }

  return initials.toUpperCase();
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const getToastMessageByType = (type) => {
  switch (type) {
    case "edit":
      return "Blog post updated successfully!";
    case "draft":
      return "Blog post saved as draft!";
    case "published":
      return "Blog post published successfully!";
    default:
      return "Blog post saved successfully!";
  }
};

//sanitize markdown content

export const sanitizeMarkdown = (content) => {
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/gm;
  const match = content.match(markdownBlockRegex);
  return match ? match[1] : content;
};

// Calculate reading time estimate
// Average reading speed: 200 words per minute
export const calculateReadingTime = (content) => {
  if (!content) return 1;

  // Remove markdown syntax and HTML tags for accurate word count
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "") // Remove inline code
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/[*_~[\]()]/g, "") // Remove markdown formatting
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "") // Remove links
    .trim();

  // Count words
  const words = plainText.split(/\s+/).filter((word) => word.length > 0).length;

  // Calculate minutes (200 words per minute)
  const minutes = Math.ceil(words / 200);

  // Return minimum of 1 minute
  return minutes < 1 ? 1 : minutes;
};
