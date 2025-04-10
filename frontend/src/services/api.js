import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle token expiration
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
      
      // Handle other errors
      const errorMessage = error.response.data?.message || "An error occurred";
      console.error("API Error:", errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request);
      return Promise.reject(new Error("Network Error - Please check your connection"));
    }
    
    // Something happened in setting up the request
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

export default instance;
  