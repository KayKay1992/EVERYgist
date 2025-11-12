import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = [
  "#0096CC",
  "#00a9c6",
  "#00bcff",
  "#1ac3ff",
  "#00cfb5",
  "#00dbaf",
  "#00e8aa",
];

const TagCloud = ({ tags }) => {
  const maxCount = Math.max(...tags.map((tag) => tag.count), 1);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const fontSize = 12 + (tag.count / maxCount) * 5; // font size between 12px and 28px
        return (
          <span key={tag.name} style={{ fontSize: `${fontSize}px` }} className="font-medium text-sky-900 bg-sky-200 rounded-lg px-3 py-0.5">
            #{tag.name}
          </span>
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
