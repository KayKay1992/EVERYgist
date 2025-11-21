import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      //Update the image preview
      setImage(file);

      //Generate preview URL from the selected file
      const preview = URL.createObjectURL(file);
      if (setPreview) {
        setPreview(preview);
      }
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (setPreview) {
      setPreview(null);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="relative group">
          <div className="w-24 h-24 flex items-center justify-center bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full border-2 border-purple-200 shadow-lg cursor-pointer group-hover:shadow-xl group-hover:border-purple-300 transition-all">
            <LuUser className="text-5xl text-purple-600" />
          </div>
          <button
            type="button"
            onClick={onChooseFile}
            className="w-9 h-9 flex items-center justify-center bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg absolute -bottom-1 -right-1 hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-110"
          >
            <LuUpload className="text-base" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview || previewUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-3 border-purple-300 shadow-lg ring-2 ring-purple-100"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-9 h-9 flex items-center justify-center bg-linear-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-lg absolute -bottom-1 -right-1 hover:shadow-xl hover:from-pink-700 hover:to-rose-700 transition-all hover:scale-110 cursor-pointer"
          >
            <LuTrash className="text-base" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
