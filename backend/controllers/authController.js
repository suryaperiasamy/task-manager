const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// Generate a random 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`>>> Signup request received for: ${email}`);

    // Check if required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    console.log(`>>> User created in DB: ${user.email}, isVerified: ${user.isVerified}`);

    if (user) {
      // Log OTP to console for easy development access
      console.log(`>>> OTP for ${user.email}: ${otp}`);

      // Send OTP to email
      const emailSent = await sendEmail(
        user.email,
        "Verify your Task Manager Account",
        `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
        otp
      );

      if (emailSent) {
        console.log("OTP Email sent successfully!");
        return res.status(201).json({
          message: `User registered successfully. ${process.env.NODE_ENV !== 'production' ? `[DEV ONLY] OTP is: ${otp}` : 'Please check your email for the OTP to verify your account.'}`,
          email: user.email,
          ...(process.env.NODE_ENV !== 'production' && { otp })
        });
      } else {
        console.error("FAILED to send OTP Email.");
        
        // Only set bypass OTP if explicitly allowed in environment
        if (process.env.ALLOW_OTP_BYPASS === "true") {
          console.log(">>> Setting DB OTP to 000000 for bypass (Testing Enabled)");
          user.otp = "000000";
          await user.save();
        }

        return res.status(201).json({ 
          message: "User created, but we had trouble sending the email.",
          email: user.email,
          ...(process.env.ALLOW_OTP_BYPASS === "true" ? { 
            otp: "000000",
            debug: "Email failed. Using test bypass 000000."
          } : {
            debug: "Email failed. Please check backend logs for SMTP errors."
          })
        });
      }
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Verify OTP for account activation
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // EMERGENCY BYPASS: Allow 000000 to skip all checks for testing IF enabled in .env
    const isBypass = (otp === "000000" && process.env.ALLOW_OTP_BYPASS === "true");

    if (!isBypass) {
      // Regular checks
      console.log(`>>> Verifying OTP for ${email}. Input: "${otp}", DB: "${user.otp}"`);
      if (user.otp !== otp) {
        console.log(`>>> OTP MISMATCH for ${email}`);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (user.otpExpires < new Date()) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
    } else {
      console.log("!!! Emergency Bypass OTP used for email:", email);
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Account verified successfully. You can now login." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your account using the OTP sent to your email before logging in." });
    }

    // Compare provided password with hashed password in database
    console.log(`>>> Login attempt for: ${email}`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`>>> Password match for ${email}: ${isMatch}`);

    if (isMatch) {
      // Send successful response with JWT token
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log(`>>> LOGIN FAILED: Invalid password for ${email}`);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Log OTP to console
    console.log(`>>> Password Reset OTP for ${user.email}: ${otp}`);

    // Send email
    await sendEmail(
      user.email,
      "Password Reset for Task Manager",
      `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
      otp
    );

    res.status(200).json({ 
      message: `Password reset OTP sent to email. ${process.env.NODE_ENV !== 'production' ? `[DEV ONLY] OTP is: ${otp}` : ''}`,
      ...(process.env.NODE_ENV !== 'production' && { otp })
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error during password reset request" });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP fields
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now login with your new password." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
};
