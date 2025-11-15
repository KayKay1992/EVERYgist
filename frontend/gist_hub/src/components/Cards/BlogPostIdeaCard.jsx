import React from 'react'

const BlogPostIdeaCard = ({
    title, description, tags, tone, onSelect, wordCount
}) => {
  return (
    <div className='border-b border-gray-100 hover:bg-gray-100/60 px-6 py-5 cursor-pointer' onClick={onSelect}>
        <h3 className='text-sm text-block font-medium'>{title}{""}
            <span className='text-xs text-yellow-900 bg-yellow-100 px-2 py-0.5 rounded-md font-normal ml-2'>({wordCount} words, {tone} tone)</span>
        </h3>
        <p className='text-xs font-medium text-gray-600 mt-1 mb-2'>{description}</p>

        <div className="flex flex-wrap items-center">
            {tags.map((tag, index) => (
                <span key={`tag_${index}`} className="inline-block bg-sky-100/70 text-sky-800 text-xs px-2 py-1 rounded-full mr-2 mb-2 font-medium">
                    {tag}
                </span>
            ))}
        </div>


    </div>
  )
}

export default BlogPostIdeaCard