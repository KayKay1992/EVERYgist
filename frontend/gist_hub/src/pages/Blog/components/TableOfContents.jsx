import React, { useState, useEffect } from "react";
import { LuList, LuChevronDown, LuChevronUp } from "react-icons/lu";

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  // Extract headings from markdown content
  useEffect(() => {
    if (!content) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extractedHeadings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length; // Number of # symbols
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      extractedHeadings.push({
        level,
        text,
        id,
      });
    }

    setHeadings(extractedHeadings);
  }, [content]);

  // Track scroll position and update active heading
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((heading) => {
          const element = document.getElementById(heading.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            return {
              id: heading.id,
              top: rect.top,
            };
          }
          return null;
        })
        .filter(Boolean);

      // Find the heading that's currently in view
      const current = headingElements.find(
        (heading) => heading.top > 0 && heading.top < 200
      );

      if (current) {
        setActiveId(current.id);
      } else if (headingElements.length > 0) {
        // If scrolled past all headings, keep the last one active
        const lastVisible = headingElements.filter((h) => h.top < 200).pop();
        if (lastVisible) {
          setActiveId(lastVisible.id);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset from top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Don't render if there are no headings or only one heading
  if (!headings || headings.length < 2) {
    return null;
  }

  return (
    <div className="sticky top-24">
      <div className="relative group">
        {/* Gradient border effect */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-500"></div>

        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between mb-4 group/header"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                <LuList className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Table of Contents
              </h3>
            </div>
            <div className="text-gray-400 group-hover/header:text-purple-600 transition-colors">
              {isExpanded ? (
                <LuChevronUp className="text-xl" />
              ) : (
                <LuChevronDown className="text-xl" />
              )}
            </div>
          </button>

          {/* Headings List */}
          {isExpanded && (
            <nav className="space-y-1">
              {headings.map((heading, index) => {
                const isActive = activeId === heading.id;
                const paddingLeft = `${(heading.level - 1) * 0.75}rem`;

                return (
                  <button
                    key={index}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left py-2 px-3 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:text-purple-600 hover:bg-purple-50/50"
                      }
                      ${heading.level === 1 ? "text-base font-bold" : ""}
                      ${heading.level === 2 ? "text-sm font-semibold" : ""}
                      ${heading.level >= 3 ? "text-sm" : ""}
                    `}
                    style={{ paddingLeft }}
                  >
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-600 to-pink-600 animate-pulse"></span>
                      )}
                      <span className="line-clamp-2">{heading.text}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Progress indicator */}
          {isExpanded && headings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Reading Progress</span>
                <span>
                  {headings.findIndex((h) => h.id === activeId) + 1} /{" "}
                  {headings.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((headings.findIndex((h) => h.id === activeId) + 1) /
                        headings.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
