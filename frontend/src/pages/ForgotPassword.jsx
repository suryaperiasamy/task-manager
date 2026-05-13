import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/forgot-password", { email });
      // Redirect to reset password page, passing the email along
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="text-center" style={{ marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              placeholder="Enter your registered email"
            />
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>
        
        <div className="text-center mt-3">
          <Link to="/login" className="link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
