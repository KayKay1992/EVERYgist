import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = [
  "#9333ea", // purple-600
  "#ec4899", // pink-600
  "#3b82f6", // blue-600
  "#8b5cf6", // violet-600
  "#f97316", // orange-600
  "#14b8a6", // teal-600
  "#6366f1", // indigo-600
];

const TagCloud = ({ tags }) => {
  const maxCount = Math.max(...tags.map((tag) => tag.count), 1);

  const gradients = [
    "from-purple-600 to-pink-600",
    "from-blue-600 to-purple-600",
    "from-pink-600 to-rose-600",
    "from-violet-600 to-purple-600",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag, index) => {
        const fontSize = 14 + (tag.count / maxCount) * 8; // font size between 14px and 22px
        const gradient = gradients[index % gradients.length];
        return (
          <div
            key={tag.name}
            className={`group relative overflow-hidden bg-linear-to-r ${gradient} rounded-xl px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span
              style={{ fontSize: `${fontSize}px` }}
              className="relative z-10 font-bold text-white flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              {tag.name}
              <span className="ml-1 text-xs bg-white/30 px-2 py-0.5 rounded-full">
                {tag.count}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

const TagInsights = ({ tagUsage }) => {
  const processedData = () => {
    if (!tagUsage || tagUsage.length === 0) return [];
    const sorted = [...tagUsage].sort((a, b) => b.count - a.count);
    const topFour = sorted.slice(0, 4);
    const others = sorted.slice(4);
    const othersCount = others.reduce((sum, item) => sum + item.count, 0); // sum of counts of other tags in top 4 tags const total = topFour.reduce((acc, curr) => acc + curr.count, 0);

    const finalData = topFour.map((item) => ({
      ...item,
      name: item.tag || "",
    }));

    if (othersCount > 0) {
      finalData.push({
        name: "Others",
        count: othersCount,
      });
    }

    return finalData;
  };
  return (
    <div className="grid grid-cols-12 mt-4">
      <div className="col-span-12 md:col-span-7">
        <CustomPieChart data={processedData()} colors={COLORS} />
      </div>
      <div className="col-span-12 md:col-span-5 mt-5 md:mt-0">
        <TagCloud
          tags={
            tagUsage.slice(0, 4).map((item) => ({
              ...item,
              name: item.tag || "",
            })) || []
          }
        />
      </div>
    </div>
  );
};

export default TagInsights;
