import React from "react";

// Small building block for skeleton rectangles
const Block = ({ className = "" }) => (
  <div
    className={`bg-gray-200/70 dark:bg-gray-700/40 rounded-md ${className}`}
  />
);

// Small building block for circular skeletons (e.g., avatar)
const Circle = ({ className = "" }) => (
  <div
    className={`bg-gray-200/70 dark:bg-gray-700/40 rounded-full ${className}`}
  />
);

/**
 * SkeletonLoader
 * A clean, reusable skeleton component with multiple variants.
 *
 * Props:
 * - variant: 'card' | 'list-item' | 'post' | 'stat' | 'line' (default: 'card')
 * - count: number of skeleton items to render (default: 1)
 * - lines: number of text lines (used in post/line variants, default: 3)
 * - showAvatar: show avatar circle for list-item/post (default: false)
 * - withBorder: add subtle border around cards (default: true for card/stat)
 * - className: extra classes for container
 */
const SkeletonLoader = ({
  variant = "card",
  count = 1,
  lines = 3,
  showAvatar = false,
  withBorder,
  className = "",
}) => {
  const items = Array.from({ length: Math.max(1, count) });

  const Card = () => (
    <div
      className={`animate-pulse bg-white rounded-2xl p-4 md:p-5 ${
        withBorder ?? true ? "border border-gray-200/60" : ""
      } shadow-sm shadow-gray-100/30 ${className}`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Block className="w-full h-36 md:h-40 rounded-xl" />
      <div className="mt-4 space-y-2.5">
        <Block className="h-4 w-3/4" />
        <Block className="h-3 w-full" />
        <Block className="h-3 w-5/6" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Block className="h-6 w-20" />
        <Block className="h-6 w-16" />
        <Block className="h-6 w-24" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Block className="h-8 w-28 rounded-lg" />
        <div className="flex gap-2">
          <Block className="h-8 w-10 rounded-lg" />
          <Block className="h-8 w-10 rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );

  const ListItem = () => (
    <div
      className={`animate-pulse bg-white rounded-xl p-3 md:p-4 ${
        withBorder ?? true ? "border border-gray-200/60" : ""
      } ${className}`}
      role="status"
      aria-busy="true"
    >
      <div className="flex items-start gap-3">
        {showAvatar && <Circle className="w-10 h-10" />}
        <div className="flex-1 space-y-2">
          <Block className="h-3.5 w-2/3" />
          <Block className="h-3 w-5/6" />
        </div>
        <Block className="hidden md:block h-6 w-16 rounded-md" />
      </div>
    </div>
  );

  const Post = () => (
    <div
      className={`animate-pulse bg-white rounded-2xl p-4 md:p-6 ${
        withBorder ?? true ? "border border-gray-200/60" : ""
      } ${className}`}
      role="status"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        {showAvatar && <Circle className="w-10 h-10 md:w-12 md:h-12" />}
        <div className="flex-1 space-y-2">
          <Block className="h-5 w-2/3" />
          <Block className="h-3 w-40" />
        </div>
      </div>
      <Block className="mt-4 w-full h-48 md:h-60 rounded-xl" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: Math.max(2, lines) }).map((_, i) => (
          <Block
            key={i}
            className={`h-3 ${i % 3 === 0 ? "w-11/12" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );

  const Stat = () => (
    <div
      className={`animate-pulse bg-white rounded-2xl p-4 ${
        withBorder ?? true ? "border border-gray-200/60" : ""
      } ${className}`}
      role="status"
      aria-busy="true"
    >
      <div className="flex items-center gap-3">
        <Circle className="w-9 h-9" />
        <div className="flex-1 space-y-2">
          <Block className="h-3 w-1/2" />
          <Block className="h-4 w-2/3" />
        </div>
      </div>
      <Block className="mt-4 h-2 w-full rounded-full" />
    </div>
  );

  const LineGroup = () => (
    <div
      className={`animate-pulse ${className}`}
      role="status"
      aria-busy="true"
    >
      {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
        <Block
          key={i}
          className={`h-3 ${
            i === 0 ? "w-2/3" : i % 2 ? "w-11/12" : "w-5/6"
          } mb-2 last:mb-0`}
        />
      ))}
    </div>
  );

  const renderVariant = (key) => {
    switch (variant) {
      case "list-item":
        return <ListItem key={key} />;
      case "post":
        return <Post key={key} />;
      case "stat":
        return <Stat key={key} />;
      case "line":
        return <LineGroup key={key} />;
      case "card":
      default:
        return <Card key={key} />;
    }
  };

  return (
    <div className="space-y-3">{items.map((_, i) => renderVariant(i))}</div>
  );
};

export default SkeletonLoader;
