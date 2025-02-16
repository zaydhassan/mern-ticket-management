
// router.get("/api/assignedtickets", authenticate, async (req, res) => {
//     try {
//         const agentId = req.user.agent_id;
//         const tickets = await Ticket.find({ agent_id: agentId });
//         res.json({ tickets });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const authenticate = require("../middleware/authenticate");

router.get("/api/assignedtickets", authenticate, async (req, res) => {
    try {
        const agentUserId = req.user.user_id; // Get user_id of the logged-in agent

        if (!agentUserId) {
            return res.status(403).json({ message: "Forbidden: User ID not found" });
        }

        // Find tickets where agent_id matches the user's user_id
        const tickets = await Ticket.find({ agent_id: agentUserId });

        res.json({ tickets });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});


