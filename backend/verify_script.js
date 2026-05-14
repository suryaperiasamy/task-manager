const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const verifyUser = async () => {
  try {
    // Check if URI exists
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const email = "suryakpsamy@gmail.com";
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true, otp: null, otpExpires: null },
      { new: true }
    );

    if (user) {
      console.log(`Success! User ${email} has been manually verified.`);
    } else {
      console.log(`User ${email} not found.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

verifyUser();
