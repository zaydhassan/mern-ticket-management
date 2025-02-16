const mongoose = require('mongoose');

const PendingUserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  password: { type: String, required: true, maxlength: 255 }, // Unencrypted for now
  role: { type: String, enum: ['Admin', 'Agent', 'Employee'], required: true },
  profile_image: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PendingUser', PendingUserSchema);
