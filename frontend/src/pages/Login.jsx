import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      
      // Save user data and token to context
      login(
        { _id: response.data._id, name: response.data.name, email: response.data.email },
        response.data.token
      );
      
      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      // If user is not verified, they might need to be redirected
      const errorMsg = err.response?.data?.message || "Invalid credentials";
      setError(errorMsg);
      
      if (errorMsg.includes("verify your account")) {
        // Optionally provide a way to resend OTP or redirect to verification
        setTimeout(() => {
          navigate("/verify-otp", { state: { email: formData.email } });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="john@example.com"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/signup" className="link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
