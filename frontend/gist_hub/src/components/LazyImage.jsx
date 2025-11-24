import React, { useState, useEffect, useRef } from "react";

/**
 * LazyImage Component
 * Implements lazy loading using Intersection Observer API
 * Supports WebP format with fallback, placeholder, and smooth transitions
 */

const LazyImage = ({
  src,
  alt = "",
  className = "",
  webpSrc = null,
  thumbnailSrc = null,
  placeholderColor = "#f3f4f6",
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(thumbnailSrc || placeholderColor);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer to detect when image is in viewport
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // Load actual image when in viewport
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();

    // Try WebP first if available and browser supports it
    const imageToLoad = webpSrc && supportsWebP() ? webpSrc : src;

    img.src = imageToLoad;

    img.onload = () => {
      setImageSrc(imageToLoad);
      setImageLoaded(true);
      onLoad();
    };

    img.onerror = () => {
      // Fallback to regular src if WebP fails
      if (webpSrc && imageToLoad === webpSrc) {
        const fallbackImg = new Image();
        fallbackImg.src = src;
        fallbackImg.onload = () => {
          setImageSrc(src);
          setImageLoaded(true);
          onLoad();
        };
        fallbackImg.onerror = () => {
          onError();
        };
      } else {
        onError();
      }
    };
  }, [isInView, src, webpSrc, onLoad, onError]);

  // Check WebP support
  const supportsWebP = () => {
    if (typeof window === "undefined") return false;

    const elem = document.createElement("canvas");
    if (elem.getContext && elem.getContext("2d")) {
      return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    }
    return false;
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: !imageLoaded ? placeholderColor : "transparent",
      }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      )}

      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
