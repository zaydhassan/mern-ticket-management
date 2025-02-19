const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const TicketAttachment = require("../models/TicketAttachments"); // Import the attachment model
const upload = require("../middleware/fileUpload"); // File upload middleware
const authenticate = require("../middleware/authenticate"); // Authentication middleware

// POST: Create a new ticket with attachments
router.post("/api/createtickets", authenticate, upload.array("attachments"), async (req, res) => {
  const { subject, description, priority, category } = req.body; // Extract form data from request

  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token

    // Validate required fields
    if (!subject || !priority || !category) {
      return res.status(400).json({ message: "All fields (subject, priority, category) are required." });
    }

    // Handle file attachments if they exist
    const attachments = req.files?.length
      ? await Promise.all(req.files.map(async (file) => {
          const attachment = new TicketAttachment({
            ticket_id: 0, // Temporary value, will be updated after ticket creation
            file_url: `uploads/${file.filename}`,
            file_name: file.originalname,
          });
          await attachment.save(); // Save each attachment
          return attachment;
        }))
      : [];

    // Find the latest ticket ID and increment it
    const latestTicket = await Ticket.findOne().sort({ ticket_id: -1 });
    const ticket_id = latestTicket ? latestTicket.ticket_id + 1 : 1;

    // Create a new ticket
    const ticket = new Ticket({
      ticket_id,
      subject,
      description,
      user_id: userId,
      priority,
      category,
      status: "Open", // Set default status to "Open"
    });

    // Save the ticket to the database
    await ticket.save();

    // Update the attachments with the correct ticket_id
    for (let attachment of attachments) {
      attachment.ticket_id = ticket.ticket_id; // Link the attachment to the created ticket
      await attachment.save(); // Update the attachment
    }

    res.status(201).json({ message: "Ticket created successfully", ticket }); // Send success response
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ message: "Error creating ticket", error: err.message });
  }
});

module.exports = router;
