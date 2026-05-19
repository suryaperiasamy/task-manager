const nodemailer = require("nodemailer");
const https = require("https");

// Create a reusable SMTP transporter using Nodemailer (for fallback/local dev)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,
  logger: false, // Keep logs clean unless debugging
  debug: false
});

/**
 * Sends an email using Brevo's HTTP API v3
 * This is immune to SMTP port blocks (like on Render free tier) as it uses standard HTTPS (port 443)
 */
const sendEmailViaBrevo = (to, subject, text, htmlContent) => {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      sender: {
        name: "Task Manager Support",
        email: process.env.EMAIL_USER || "suryakpsamy@gmail.com"
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    console.log(`>>> Attempting to send email via Brevo HTTP API to ${to}...`);

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(">>> Brevo HTTP API success! Email sent successfully. Response:", body);
          resolve(true);
        } else {
          console.error(">>> Brevo HTTP API failed with status:", res.statusCode, "Response:", body);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error(">>> Brevo HTTP Request error:", error);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Core send email utility
 */
const sendEmail = async (to, subject, text, otp = null) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4F46E5; text-align: center;">Task Manager Authentication</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">${text}</p>
      ${otp ? `
      <div style="background-color: #F3F4F6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">
          ${otp}
        </span>
      </div>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
  `;

  // 1. If BREVO_API_KEY is configured in the environment, use Brevo's HTTP API (Production/Render environment)
  if (process.env.BREVO_API_KEY) {
    return await sendEmailViaBrevo(to, subject, text, htmlContent);
  }

  // 2. Otherwise, fall back to Nodemailer SMTP (Local development)
  try {
    const mailOptions = {
      from: `"Task Manager Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: htmlContent
    };

    console.log(`>>> Attempting to send email via standard SMTP to ${to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(">>> SMTP success! Email sent successfully. Message ID:", info.messageId);
    return true;
  } catch (error) {
    console.error(">>> SMTP error sending email:", error);
    return false;
  }
};

module.exports = { sendEmail };
