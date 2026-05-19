require("dotenv").config();
const { sendEmail } = require("./utils/emailService");

const testMail = async () => {
  console.log("Starting email test...");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS (length):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  
  const recipient = process.env.EMAIL_USER || "suryakpsamy@gmail.com";
  console.log(`Attempting to send test email to ${recipient}...`);
  
  const success = await sendEmail(
    recipient,
    "Task Manager Test Email",
    "This is a test email to verify the SMTP/OTP configuration.",
    "123456"
  );
  
  if (success) {
    console.log("SUCCESS: Email sent successfully!");
  } else {
    console.log("FAILED: Email sending failed. Please check the logs above.");
  }
};

testMail();
