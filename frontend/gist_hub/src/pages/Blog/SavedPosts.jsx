import React, { useState, useEffect } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { getBookmarks } from "../../utils/bookmarkUtils";
import { useNavigate } from "react-router-dom";
import { LuBookmark, LuSearch, LuTrash2 } from "react-icons/lu";
import moment from "moment";
import BookmarkButton from "../../components/BookmarkButton";

const SavedPosts = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const savedBookmarks = getBookmarks();
    setBookmarks(savedBookmarks);
  };

  const handlePostClick = (slug) => {
    navigate(`/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BlogLayout activeMenu="Saved Posts">
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-amber-50/20 to-orange-50/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white border-b border-gray-200">
          <div className="absolute inset-0 bg-linear-to-br from-amber-600/5 via-yellow-600/5 to-orange-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-amber-100 to-orange-100 rounded-full border-2 border-amber-200 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                  <LuBookmark className="text-white text-lg" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Your Library
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-600">
                    Saved Posts
                  </h1>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 font-medium">
                You have{" "}
                <span className="font-bold text-amber-600">
                  {bookmarks.length}
                </span>{" "}
                {bookmarks.length === 1 ? "saved post" : "saved posts"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group cursor-pointer bg-white rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div
                    onClick={() => handlePostClick(bookmark.slug)}
                    className="relative h-48 overflow-hidden bg-gray-100"
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={bookmark.coverImageUrl}
                      alt={bookmark.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Bookmark Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <BookmarkButton post={bookmark} variant="icon" />
                    </div>
                    {/* Tags Badge */}
                    {bookmark.tags && bookmark.tags.length > 0 && (
                      <div className="absolute bottom-3 left-3 z-20">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-amber-600 to-orange-600 text-white shadow-lg">
                          #{bookmark.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    onClick={() => handlePostClick(bookmark.slug)}
                    className="p-5"
                  >
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300 line-clamp-2 mb-3">
                      {bookmark.title}
                    </h4>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="text-xs flex items-center gap-1">
                        <LuBookmark className="w-3 h-3" />
                        Saved{" "}
                        {moment(bookmark.bookmarkedAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <LuBookmark className="text-amber-400 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No saved posts yet
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Start bookmarking your favorite articles to read them later.
                  <br />
                  Click the bookmark icon on any post to save it here!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <LuSearch className="text-lg" />
                  <span>Browse Posts</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BlogLayout>
  );
};

export default SavedPosts;
