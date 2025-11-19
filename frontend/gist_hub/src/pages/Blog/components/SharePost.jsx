import React, { useState } from "react";
import { LuCheck, LuCopy, LuShare2 } from "react-icons/lu";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

const SharePost = ({ title }) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      title + " " + shareUrl
    )}`;
    window.open(whatsappUrl, "_blank", "width=600,height=400");
  };

  const handleTikTokShare = () => {
    // TikTok doesn't have a direct web share URL, so we'll copy the link
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied! You can now paste it in TikTok.");
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <LuShare2 size={18} className="text-gray-700" />
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Share Article
        </h3>
      </div>

      <div className="flex items-center gap-3">
        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center cursor-pointer"
          title="Share on Facebook"
        >
          <FaFacebookF size={18} className="text-blue-600" />
        </button>

        {/* Twitter */}
        <button
          onClick={handleTwitterShare}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-sky-500 hover:bg-sky-50 transition-all flex items-center justify-center cursor-pointer"
          title="Share on Twitter"
        >
          <FaTwitter size={18} className="text-sky-500" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center cursor-pointer"
          title="Share on LinkedIn"
        >
          <FaLinkedinIn size={18} className="text-blue-700" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsAppShare}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center cursor-pointer"
          title="Share on WhatsApp"
        >
          <FaWhatsapp size={18} className="text-green-600" />
        </button>

        {/* TikTok */}
        <button
          onClick={handleTikTokShare}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center cursor-pointer"
          title="Share on TikTok"
        >
          <FaTiktok size={18} className="text-gray-900" />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-1"></div>

        {/* Copy Link */}
        <button
          onClick={handleCopyClick}
          className="w-10 h-10 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
          title={isCopied ? "Copied!" : "Copy link"}
        >
          {isCopied ? (
            <LuCheck className="text-green-600" size={20} />
          ) : (
            <LuCopy
              size={20}
              className="text-gray-600 group-hover:text-gray-900"
            />
          )}
        </button>
      </div>

      {isCopied && (
        <p className="text-xs text-green-600 mt-3 font-medium">
          Link copied to clipboard
        </p>
      )}
    </div>
  );
};

export default SharePost;
