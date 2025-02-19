const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");

// Fetch comments for a ticket
router.get("/:ticketId/comments", authenticate, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket_id: req.params.ticketId });

    if (!comments.length) {
      return res.status(404).json({ message: "No comments found for this ticket" });
    }

    res.json({ comments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a new comment
router.post("/:ticketId/comments", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.ticketId;
    const authUserId = req.user.id; // Authenticated user ID

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Fetch user details using user_id
    const user = await User.findOne({ user_id: authUserId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch ticket
    const ticket = await Ticket.findOne({ ticket_id: ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update ticket status if it's "Open"
    if (ticket.status === "Open") {
      ticket.status = "In Progress";
      await ticket.save();
    }

    // Determine display name
    const displayName = user.role === "Agent" ? "Support Agent" : "Employee";

    // Create and save the comment
    const newComment = new Comment({
      ticket_id: ticketId,
      user_id: user.user_id, // Store user_id from users table
      username: displayName,
      content,
      created_at: new Date(),
    });

    await newComment.save();
    res.json({ comment: newComment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
