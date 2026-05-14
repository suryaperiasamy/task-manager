const mongoose = require("mongoose");
const User = require("./backend/models/User");
require("dotenv").config({ path: "./backend/.env" });

const verifyUser = async () => {
  try {
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
    console.error("Error:", err);
    process.exit(1);
  }
};

verifyUser();
