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

    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter your password");
      return;
    }

    setError(""); //clear previous errors

    //Login API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });

      const {token, role } = response.data;
      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Navigate based on role
        if(role === "admin"){
           setOpenAuthForm(false);
          navigate("/admin/dashboard");
        } 
        setOpenAuthForm(false);
       
      }

    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center">
      <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-0.5 mb-6 ">
          Please enter your details to login.
        </p>
        <form className="" onSubmit={handleLogin}>
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
          {error && <p className="text-red-600 text-xs pb-2.5">{error}</p>}
          <button type="submit" className="btn-primary">
            LOGIN
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <button
              className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                setCurrentPage("signup");
              }}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
      <div className="hidden md:block ">
        <img
          src={AUTH_IMG}
          alt="auth-img"
          className="
        h-[400px]"
        />
      </div>
    </div>
  );
};

export default Login;
