const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, "email isVerified");
    console.log("Current Users in DB:");
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

listUsers();
