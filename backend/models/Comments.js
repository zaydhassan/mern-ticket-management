const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  ticket_id: { type: Number, required: true },  // Change to Number (or String if needed)
  user_id: { type: Number, required: true },    // Change to Number (or String if needed)
  username: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
