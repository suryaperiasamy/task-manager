import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from the navigation state (passed from Signup)
  const email = location.state?.email || "";
  const initialMessage = location.state?.message || "";

  // If someone tries to access this page without coming from signup/login, redirect them
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
    if (initialMessage) {
      setSuccess(initialMessage);
    }
  }, [email, navigate, initialMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await API.post("/auth/verify-otp", { email, otp });
      setSuccess("Account verified successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p className="text-center" style={{ marginBottom: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control"
              required
              maxLength="6"
              placeholder="123456"
              style={{ textAlign: "center", letterSpacing: "5px", fontSize: "1.25rem" }}
            />
            <p className="text-center" style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--primary-color)", fontWeight: "bold" }}>
              Hint for testing: Use OTP 000000
            </p>
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
