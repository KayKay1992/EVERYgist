import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ type, label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          className="border-2 border-purple-200 rounded-lg px-4 py-2.5 w-full outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all bg-white hover:border-purple-300"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
          >
            {showPassword ? (
              <FaRegEyeSlash className="text-lg" />
            ) : (
              <FaRegEye className="text-lg" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
