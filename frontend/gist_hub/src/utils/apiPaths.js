export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: `/api/auth/register`, //Signup
    LOGIN: `/api/auth/login`, //Login
    GET_PROFILE: `/api/auth/profile`, //Get user profile
    UPDATE_PROFILE: `/api/auth/profile`, //Update user profile
    CHANGE_PASSWORD: `/api/auth/change-password`, //Change password
    MY_COMMENTS: `/api/auth/my-comments`, //Get user's own comments
  },
  IMAGE: {
    UPLOAD_IMAGE: `/api/auth/upload-image`, //Upload profile image
  },
  DASHBOARD: {
    GET_DASHBOARD_DATA: `/api/dashboard-summary`, //Get dashboard summary data
  },
  AI: {
    GENERATE_BLOG_POST: `/api/ai/generate`, //Generate AI blog post
    GENERATE_BLOG_POST_IDEAS: `/api/ai/generate-ideas`, //Generate AI blog ideas
    GENERATE_COMMENT_REPLY: `/api/ai/generate-reply`, //Generate AI comment reply
    GENERATE_POST_SUMMARY: `/api/ai/generate-summary`, //Generate AI post summary
  },
  POSTS: {
    GET_ALL: `/api/posts`, //Get all blog posts with optional status and pagination
    CREATE_POST: `/api/posts`, //Create a new blog post
    UPDATE: (id) => `/api/posts/${id}`, //Update a blog post
    GET_BY_SLUG: (slug) => `/api/posts/slug/${slug}`, //Get blog post by slug
    GET_TRENDING_POSTS: `/api/posts/trending`, //Get trending blog posts
    DELETE: (id) => `/api/posts/${id}`, //Delete a blog post
    GET_BY_TAG: (tag) => `/api/posts/tag/${tag}`, //Get blog posts by tag
    SEARCH: `/api/posts/search`, //Search blog posts
    INCREMENT_VIEW: (id) => `/api/posts/${id}/view`, //Increment view count
    LIKE_POST: (id) => `/api/posts/${id}/like`, //Like a blog post
  },
  COMMENTS: {
    ADD: (postId) => `/api/comments/${postId}`, //Add a comment to a blog post
    GET_ALL_BY_POST: (postId) => `/api/comments/${postId}`, //Get comments for a specific blog post
    DELETE: (commentId) => `/api/comments/${commentId}`, //Delete a comment
    GET_ALL: `/api/comments`, //Get all comments with optional pagination
  },
};
