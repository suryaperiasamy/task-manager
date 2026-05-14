import axios from "axios";

// Create an Axios instance with base URL
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";
console.log("Current API Base URL:", baseURL);

const API = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor to automatically attach the JWT token to headers
API.interceptors.request.use(
  (config) => {
    // Look for the token in local storage
    const token = localStorage.getItem("token");

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

export default API;
