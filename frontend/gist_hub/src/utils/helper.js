export const getInitials = (title) => {
  if (!title) return '';

  const words = title.trim().split(' ');
  let initials = '';

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
    case 'edit':
      return 'Blog post updated successfully!';
    case 'draft':
      return 'Blog post saved as draft!';
    case 'published':
      return 'Blog post published successfully!';
    default:
      return 'Blog post saved successfully!';
  }
};

//sanitize markdown content 

export const sanitizeMarkdown = (content) => {
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/gm;
  const match = content.match(markdownBlockRegex);
  return match ? match[1] : content;
};