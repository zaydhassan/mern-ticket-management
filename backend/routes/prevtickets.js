const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const authenticate = require("../middleware/authenticate");

// Get all previous tickets for the logged-in user
router.get("/api/prevtickets", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT token
    const tickets = await Ticket.find({ user_id: userId }).sort({ created_at: -1 });

    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
