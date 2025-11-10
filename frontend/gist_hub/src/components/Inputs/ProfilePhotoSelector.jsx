import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
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

        if(setPreview){
            setPreview(null);
        }
      };

      const onChooseFile = () => {
        inputRef.current.click();
      }
  return (
    <div className='flex justify-center mb-6'>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
       
        onChange={handleImageChange}
        className='hidden'
      />
      {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-sky-50 rounded-full relative cursor-pointer'>
          <LuUser className='text-4xl text-sky-500' />
        
        <button
          type="button"
          onClick={onChooseFile}
          className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-sky-500 to-cyan-400 text-white rounded-full absolute bottom-0 right-0 hover:opacity-90 transition-opacity"
        >
          <LuUpload className="inline-block" /> 
        </button>
        </div>
      ): (
        <div className='relative'>
          <img
            src={preview|| previewUrl}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover"
            />
            <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute bottom-0 right-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <LuTrash className="inline-block" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector