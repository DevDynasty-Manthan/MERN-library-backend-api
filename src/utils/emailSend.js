import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("Admin Email:", process.env.ADMIN_EMAIL);
console.log("Admin Pass:", process.env.ADMIN_EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Admin" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// sendEmail({
//   to: "manthangajbhiye992@gmail.com",
//   subject: "Test Email",
//   html: "<p>This is a test email body</p>",
// });

export default sendEmail;