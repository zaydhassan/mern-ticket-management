const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
    ticket_id: { type: Number, ref: "Ticket", required: true },
    customer_id: { type: Number, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String },
    rated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rating", RatingSchema);
