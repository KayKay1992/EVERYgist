import React from "react";

const FeaturedBlogPost = ({
  title,
  description,
  coverImageUrl,
  tags = [],
  updatedOn,
  authorName,
  authorProfileImg,
  onClick,
}) => {
  return (
    <div
      className="group relative grid grid-cols-1 md:grid-cols-12 bg-linear-to-br from-white via-white to-purple-50/30 gap-0 md:gap-6 shadow-2xl shadow-purple-100/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-3xl hover:shadow-purple-200/60 hover:-translate-y-2 border border-purple-100/20 z-0"
      onClick={onClick}
    >
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-10 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/50 flex items-center gap-2 animate-pulse">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Featured
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-purple-400/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-pink-400/10 to-transparent rounded-full blur-2xl"></div>

      {/* Image Section */}
      <div className="col-span-1 md:col-span-7 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Read Time Badge on Image */}
        <div className="absolute bottom-4 left-4 z-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-700">
            5 min read
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="col-span-1 md:col-span-5 relative z-10">
        <div className="p-6 md:p-8 flex flex-col h-full justify-between">
          <div>
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4 line-clamp-2 bg-linear-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent leading-tight group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-purple-700 transition-all duration-500">
              {title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
              {description}
            </p>

            {/* Tags */}
            <div className="flex items-center flex-wrap gap-2 mb-6">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="relative bg-linear-to-r from-purple-100 via-pink-100 to-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-purple-200/50"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-purple-600 font-medium">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Author Info & CTA */}
          <div className="space-y-4">
            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-purple-200 to-transparent"></div>

            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={authorProfileImg}
                    alt={authorName}
                    className="relative w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-lg"
                  />
                  {/* Online Status */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {authorName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {updatedOn}
                  </p>
                </div>
              </div>

              {/* Read More Button */}
              <button className="group/btn relative px-5 py-2.5 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2 text-sm">
                  Read More
                  <svg
                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-rose-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogPost;
