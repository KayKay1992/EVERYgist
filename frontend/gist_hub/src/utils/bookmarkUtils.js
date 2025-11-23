// Bookmark utility functions using localStorage

const BOOKMARKS_KEY = "gist_hub_bookmarks";

/**
 * Get all bookmarked posts
 * @returns {Array} Array of bookmarked post objects
 */
export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem(BOOKMARKS_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error("Error getting bookmarks:", error);
    return [];
  }
};

/**
 * Check if a post is bookmarked
 * @param {string} postId - The post ID to check
 * @returns {boolean} True if bookmarked, false otherwise
 */
export const isBookmarked = (postId) => {
  const bookmarks = getBookmarks();
  return bookmarks.some((bookmark) => bookmark.id === postId);
};

/**
 * Add a post to bookmarks
 * @param {Object} post - The post object to bookmark
 * @returns {boolean} True if successful, false otherwise
 */
export const addBookmark = (post) => {
  try {
    const bookmarks = getBookmarks();

    // Check if already bookmarked
    if (bookmarks.some((bookmark) => bookmark.id === post.id)) {
      return false;
    }

    const bookmarkData = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      coverImageUrl: post.coverImageUrl,
      tags: post.tags || [],
      bookmarkedAt: new Date().toISOString(),
    };

    bookmarks.push(bookmarkData);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return false;
  }
};

/**
 * Remove a post from bookmarks
 * @param {string} postId - The post ID to remove
 * @returns {boolean} True if successful, false otherwise
 */
export const removeBookmark = (postId) => {
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter((bookmark) => bookmark.id !== postId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return false;
  }
};

/**
 * Toggle bookmark status for a post
 * @param {Object} post - The post object
 * @returns {boolean} New bookmark status (true if now bookmarked, false if removed)
 */
export const toggleBookmark = (post) => {
  if (isBookmarked(post.id)) {
    removeBookmark(post.id);
    return false;
  } else {
    addBookmark(post);
    return true;
  }
};

/**
 * Get bookmark count
 * @returns {number} Number of bookmarked posts
 */
export const getBookmarkCount = () => {
  return getBookmarks().length;
};
