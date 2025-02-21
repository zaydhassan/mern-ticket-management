const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // Import the Ticket model

// Get all resolved tickets
router.get("/api/tickets/resolved", async (req, res) => {
    try {
        const resolvedTickets = await Ticket.find({ status: "Resolved" });
        res.json(resolvedTickets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tickets", error });
    }
});

// Update ticket status to "Closed"
router.put("/api/tickets/close/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: "Closed" }, { new: true });
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Error closing ticket", error });
    }
});

module.exports = router;
