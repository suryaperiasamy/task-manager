import axios from "axios";

// Use environment variables for the API URL, or fallback to sensible defaults
const baseURL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" 
    : "https://task-manager-api-i25w.onrender.com/api"
);

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
