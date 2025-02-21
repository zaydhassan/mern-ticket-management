const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const authenticate = require("../middleware/authenticate");

router.post("/api/ticket/:ticketId/rate", authenticate, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { rating, feedback } = req.body;
        const customerId = req.user.id; 

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid rating value" });
        }

        const newRating = new Rating({
            ticket_id: ticketId,
            customer_id: customerId,
            rating,
            feedback
        });

        await newRating.save();
        res.status(201).json({ message: "Rating submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
