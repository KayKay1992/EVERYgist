import React from 'react'
import { useState } from 'react';
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa"

const Input = ({
    type,
    label,
    value,
    onChange,
    placeholder
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
  return (
    <div className="mb-4">
      <label className="text-[13px] text-slate-800">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          className="border border-sky-200 rounded-md p-2 w-full outline-none focus:border-sky-500 transition-colors"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-primary"
          >
            {showPassword ? <FaRegEyeSlash  /> : <FaRegEye />}
          </button>
        )}
      </div>
    </div>
  )
}

export default Input