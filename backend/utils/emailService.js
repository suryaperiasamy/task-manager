const nodemailer = require("nodemailer");

// Create a reusable transporter using Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // This helps bypass some cloud network restrictions
    rejectUnauthorized: false
  },
  logger: true, // Log everything to the console for debugging
  debug: true   // Include SMTP traffic in the logs
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Task Manager Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4F46E5; text-align: center;">Task Manager Authentication</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Here is your verification OTP. Please enter it in the application to continue.</p>
          <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
              ${text.replace(/[^0-9]/g, '')}
            </span>
          </div>
          <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendEmail };
