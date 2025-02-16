const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  password: { type: String, required: true, maxlength: 255 },
  role: { type: String, enum: ["Admin", "Agent", "Employee"], required: true },
  profile_image: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});


// Hash password before saving (for new users & password updates)
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Method to compare passwords (for login & change password)
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
