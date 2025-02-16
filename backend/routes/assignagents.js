const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate"); 

// Fetch all agents
router.get("/api/agents", authenticate, async (req, res) => {
  try {
    const agents = await User.find({ role: "Agent" }).select("user_id name email");
    res.json({ agents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching agents", error: err.message });
  }
});

// Assign agent to a ticket
router.put("/api/tickets/:ticketId/assign", authenticate, async (req, res) => {
  const { ticketId } = req.params;
  const { agent_id } = req.body;

  if (!agent_id) {
    return res.status(400).json({ message: "Agent ID is required" });
  }

  try {
    const ticket = await Ticket.findOne({ ticket_id: ticketId });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const agent = await User.findOne({ user_id: agent_id, role: "Agent" });

    if (!agent) {
      return res.status(400).json({ message: "Invalid agent" });
    }

    ticket.agent_id = agent_id;
    await ticket.save();

    res.json({ message: "Agent assigned successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Error assigning agent", error: err.message });
  }
});

module.exports = router;
