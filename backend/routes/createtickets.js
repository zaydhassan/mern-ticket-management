const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const upload = require("../middleware/fileUpload");
const authenticate = require("../middleware/authenticate"); // JWT authentication middleware

// POST: Create a new ticket with attachments
router.post("/api/createtickets", authenticate, upload.array("attachments"), async (req, res) => {
  const { subject, description, priority, category } = req.body; 

  try {
    const userId = req.user.id; // Get user ID from the JWT token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Validate required fields
    if (!subject || !priority || !category) {
      return res.status(400).json({ message: "All fields (title, description, priority, category) are required." });
    }

    // Ensure category is valid
    const validCategories = ["IT", "HR", "Admin"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category. Choose from IT, HR, Admin." });
    }

    // Handle file attachments if any
    const attachments = req.files?.length
      ? req.files.map((file) => ({
          fileName: file.originalname,
          fileUrl: `uploads/${file.filename}`,
        }))
      : [];

    // Find the latest ticket ID to increment
    const latestTicket = await Ticket.findOne().sort({ ticket_id: -1 });
    const ticket_id = latestTicket ? latestTicket.ticket_id + 1 : 1;

    // Create the new ticket
    const ticket = new Ticket({
      ticket_id,
      subject,
      description,
      user_id: userId, // Store the authenticated user's ID
      priority,
      category, // Save category
      status: "Open",
      attachments,
    });

    await ticket.save(); // Save the ticket in the database

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Error creating ticket", error: err.message });
  }
});

module.exports = router;
