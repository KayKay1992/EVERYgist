import React, { useState, useEffect } from "react";
import { LuType, LuMinus, LuPlus } from "react-icons/lu";

const FontSizeControl = ({ variant = "floating" }) => {
  const [fontSize, setFontSize] = useState("medium");
  const [isOpen, setIsOpen] = useState(false);

  // Font size options
  const fontSizes = {
    small: { label: "Small", class: "text-sm", value: "small" },
    medium: { label: "Medium", class: "text-base", value: "medium" },
    large: { label: "Large", class: "text-lg", value: "large" },
    xlarge: { label: "X-Large", class: "text-xl", value: "xlarge" },
  };

  useEffect(() => {
    // Load saved font size preference
    const savedFontSize = localStorage.getItem("reader_font_size");
    if (savedFontSize && fontSizes[savedFontSize]) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }
  }, []);

  const applyFontSize = (size) => {
    // Remove all font size classes
    document.documentElement.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
      "font-size-xlarge"
    );
    // Add selected font size class
    document.documentElement.classList.add(`font-size-${size}`);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem("reader_font_size", size);
    setIsOpen(false);
  };

  const increaseFontSize = () => {
    const sizes = Object.keys(fontSizes);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      handleFontSizeChange(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = Object.keys(fontSizes);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      handleFontSizeChange(sizes[currentIndex - 1]);
    }
  };

  // Floating variant (for blog post view)
  if (variant === "floating") {
    return (
      <div className="relative group">
        {/* Animated Glow Effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 via-violet-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 blur-lg transition duration-500 group-hover:duration-300 animate-pulse"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-3 px-6 py-4 bg-white backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-indigo-200 transition-all duration-500 hover:scale-110 overflow-hidden"
          title="Adjust font size"
        >
          {/* Background Gradient on Hover */}
          <div className="absolute inset-0 bg-linear-to-r from-indigo-50 via-violet-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-20 scale-0 group-hover:scale-150 transition-all duration-700"></div>

          <div className="relative flex items-center gap-3">
            <LuType className="text-3xl text-gray-600 group-hover:text-indigo-600 transition-all duration-500" />
          </div>

          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-sm font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl transform -translate-x-2 group-hover:translate-x-0">
            <span className="flex items-center gap-2">
              🔤 Font Size: {fontSizes[fontSize].label}
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-gray-900/95"></span>
          </span>
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 p-4 min-w-[280px] animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <LuType className="text-indigo-600 text-lg" />
              <h3 className="font-bold text-gray-900">Text Size</h3>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center justify-between gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === "small"}
                className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group/btn"
                title="Decrease font size"
              >
                <LuMinus className="text-gray-600 group-hover/btn:text-indigo-600" />
              </button>

              <div className="flex-1 text-center">
                <span className="text-sm font-semibold text-indigo-600">
                  {fontSizes[fontSize].label}
                </span>
              </div>

              <button
                onClick={increaseFontSize}
                disabled={fontSize === "xlarge"}
                className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group/btn"
                title="Increase font size"
              >
                <LuPlus className="text-gray-600 group-hover/btn:text-indigo-600" />
              </button>
            </div>

            {/* Font Size Options */}
            <div className="space-y-2">
              {Object.entries(fontSizes).map(([key, { label, value }]) => (
                <button
                  key={key}
                  onClick={() => handleFontSizeChange(value)}
                  className={`w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 flex items-center justify-between ${
                    fontSize === value
                      ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg scale-105"
                      : "bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                >
                  <span className={fontSizes[key].class}>{label}</span>
                  {fontSize === value && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your preference is saved automatically
            </p>
          </div>
        )}
      </div>
    );
  }

  // Compact inline variant
  return (
    <div className="inline-flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
      <LuType className="text-gray-600 text-lg ml-2" />
      <button
        onClick={decreaseFontSize}
        disabled={fontSize === "small"}
        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        title="Decrease"
      >
        <LuMinus className="text-sm" />
      </button>
      <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
        {fontSizes[fontSize].label}
      </span>
      <button
        onClick={increaseFontSize}
        disabled={fontSize === "xlarge"}
        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        title="Increase"
      >
        <LuPlus className="text-sm" />
      </button>
    </div>
  );
};

export default FontSizeControl;
