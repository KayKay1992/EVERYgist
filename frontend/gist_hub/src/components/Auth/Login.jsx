import React from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import AUTH_IMG from "../../assets/auth-img-blog.jpg";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  //handle Login Form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(""); //clear previous errors

    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Navigate based on role
        if (role === "admin") {
          setOpenAuthForm(false);
          navigate("/admin/dashboard");
        }
        setOpenAuthForm(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center min-h-[450px]">
      <div className="w-[90vw] md:w-[40vw] p-10 flex flex-col justify-center">
        <div className="mb-8">
          <h3 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h3>
          <p className="text-sm text-gray-600">
            Please enter your details to login.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Enter your password"
          />
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <button type="submit" className="btn-primary w-full">
            LOGIN
          </button>
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              className="font-semibold text-primary hover:underline cursor-pointer"
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
      <div className="hidden md:block">
        <img
          src={AUTH_IMG}
          alt="auth-img"
          className="h-[450px] w-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
