const express = require("express");
const crypto = require("crypto"); // For generating secure tokens
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer"); // For sending emails

const router = express.Router();

// Configure Nodemailer (Replace with actual SMTP details)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @route   POST /forgot-password
 * @desc    Send password reset email
 */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token and expiration time
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send email with reset link
    const resetLink = `${process.env.RESET_PASSWORD_BASE_URL}/${resetToken}`;
    const mailOptions = {
      from: "your-email@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /reset-password/:token
 * @desc    Reset the user's password
 */
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Ensure token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
