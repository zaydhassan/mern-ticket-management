const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const PendingUser = require('../models/PendingUser'); // Ensure correct import

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: './uploads/', // Ensure this folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, or .png files are allowed!'));
  }
};

// Configure multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file limit
  fileFilter,
});

router.post('/api/register', upload.single('profile_image'), async (req, res) => {
  try {
    const { user_id, name, email, password, role } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : '';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new PendingUser({
      user_id,
      name,
      email,
      password: hashedPassword,
      role,
      profile_image,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration pending approval by admin' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
});

module.exports = router;
