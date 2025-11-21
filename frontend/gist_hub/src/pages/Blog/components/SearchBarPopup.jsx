import React from "react";
import { useState } from "react";
import { LuSearch, LuSparkles, LuTrendingUp } from "react-icons/lu";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";

const SearchBarPopup = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    const searchQuery = query.trim();
    setQuery("");
    setIsOpen(false);
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularSearches = [
    "Technology",
    "Programming",
    "Design",
    "Health",
    "Education",
  ];

  const handlePopularSearch = (term) => {
    setQuery("");
    setIsOpen(false);
    navigate(`/search?query=${term}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} hideHeader>
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-purple-100 to-pink-100 mb-4">
            <LuSearch className="text-purple-600 text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Search Articles
          </h2>
          <p className="text-gray-600">Find your next great read</p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-focus-within:opacity-40 blur transition duration-300"></div>
            <div className="relative flex items-center bg-white rounded-2xl border-2 border-purple-200 focus-within:border-purple-400 transition-all duration-300">
              <div className="pl-5 pr-3">
                <LuSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                value={query}
                onChange={({ target }) => setQuery(target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for articles, topics, keywords..."
                className="flex-1 py-4 pr-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg"
                autoFocus
              />
              <button
                onClick={handleSearch}
                disabled={!query.trim()}
                className="mr-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <LuTrendingUp className="text-purple-600" />
            <span>Popular Searches</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => handlePopularSearch(term)}
                className="group px-5 py-2.5 bg-linear-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-full text-sm font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <LuSparkles className="text-purple-500 text-xs" />
                  {term}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Tips */}
        <div className="mt-8 p-4 bg-linear-to-br from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold text-purple-600">Tip:</span> Use
            specific keywords for more accurate results
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SearchBarPopup;
