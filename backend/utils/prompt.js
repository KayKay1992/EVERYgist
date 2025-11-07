const blogPostIdeasPrompt = (topic) => `Generate list of 5 blog post ideas related to ${topic}.
For each blog post idea, return:
- A catchy title
- A brief description (2-3 sentences) of the blog post idea
- 3 relevant tags/keywords associated with the blog post idea
- A suggested word count for the blog post
- the tone should be engaging and informative
- the tone should be suitable for a general audience interested in ${topic}
- the tone (e.g., casual, technical, beginner-friendly, formal, humorous) 

Return the result as an array of objects in JSON format:
[
  {
    "title": "",
    "description": "",
    "tags": ["", "", ""],
    "wordCount": 1000,
    "tone": ""
  },
  ...
]
  Important: Ensure the JSON is properly formatted without any extra text or explanation.
`;

function generateReplyPrompt(comment) {
    const authorName = comment.author?.name || "User";
    const content = comment.content || "";
    return `You are replying to a blog comment made by ${authorName}. The comment content is as follows:
"${content}"
Generate a thoughtful and relevant reply to this comment. Ensure the reply is respectful, engaging, and adds value to the discussion. Keep the reply concise, ideally between 50 to 200 words.`;
}

const postSummaryPrompt = (blogContent) => (
    `You are an AI assistant tasked with generating a concise summary of a blog post.
    
    Instructions:
    - Read the provided blog post content carefully.
    - Generate a short, catchy, SEO-friendly title (max 12 words) that encapsulates the main theme of the blog post.
    - Write a clear, engaging summary of about 300 words that captures the essence of the blog post.
    - Ensure the summary is easy to read and understand, avoiding technical jargon.
    - The tone should be informative and engaging, suitable for a general audience interested in the blog's topic.
    - At the end of the summary, add a markdown section titled **## what you will learn** that lists 3-5 key takeaways from the blog post in bullet points.
    
    Return the result in **valid JSON format** as follows:
    {
      "title": "Short SEO-friendly Title",
      "summary": "300-word engaging summary with a markdown section for what you will learn",
      "what_you_will_learn": [
        "Key takeaway 1",
        "Key takeaway 2",
        "Key takeaway 3"
      ]
    }
      Only return valid JSON. Do not include markdown or code blocks around the JSON.
    Ensure the JSON is properly formatted without any extra text or explanation.

    Blog Post Content:
    """${blogContent}"""
    `
)

module.exports = {
    blogPostIdeasPrompt,
    generateReplyPrompt,
    postSummaryPrompt,
};