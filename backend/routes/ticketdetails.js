// const express = require("express");
// const router = express.Router();
// const Ticket = require("../models/Ticket"); // Adjust the path based on your project structure


// // Route to get ticket details by ticket ID
// router.get("/api/ticket/:ticketId", async (req, res) => {
//     try {
//         const ticketId = req.params.ticketId;
//         const ticket = await Ticket.findOne({ ticket_id: ticketId });

//         if (!ticket) {
//             return res.status(404).json({ message: "Ticket not found" });
//         }

//         res.json({ ticket });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const TicketAttachment = require("../models/TicketAttachments"); // Import the TicketAttachment model

// Route to get ticket details along with attachments
router.get("/api/ticket/:ticketId", async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = await Ticket.findOne({ ticket_id: ticketId });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Fetch attachments separately
        const attachments = await TicketAttachment.find({ ticket_id: ticketId });

        // Merge the ticket and attachments data
        ticket.attachments = attachments;

        res.json({ ticket });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

