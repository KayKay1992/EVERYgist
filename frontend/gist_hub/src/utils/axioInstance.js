import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000, //80 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Request interceptor to add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //handle errors globally
    if (error.response) {
      //server responded with a status other than 2xx
      if (error.response.status === 401) {
        //handle unauthorized errors, e.g., redirect to login
        console.error("Unauthorized! Redirecting to login...");
        //window.location.href = '/login'; //uncomment in real app
      } else if (error.response.status === 500) {
        console.error("Server error occurred. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
