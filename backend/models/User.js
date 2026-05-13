const mongoose = require("mongoose");

// Define the User schema structure
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Ensures no duplicate emails
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // We don't limit max length here because it will be hashed
    },
    isVerified: {
      type: Boolean,
      default: false, // Users are unverified by default until they enter the OTP
    },
    otp: {
      type: String,
      default: null, // Stores the 6-digit OTP
    },
    otpExpires: {
      type: Date,
      default: null, // Stores when the OTP will expire
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
