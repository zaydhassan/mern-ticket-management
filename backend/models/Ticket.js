const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Schema for tickets
const ticketSchema = new mongoose.Schema({
  ticket_id: { type: Number },
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  user_id: { type: Number, required: true },
  agent_id: { type: Number, default: null },
  category: { type: String, enum: ["IT", "HR", "Admin"], default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketAttachment' }] // Reference to TicketAttachment
});

// Auto-increment for ticket_id (unique ID for each ticket)
ticketSchema.plugin(AutoIncrement, { inc_field: "ticket_id" });

module.exports = mongoose.model("Ticket", ticketSchema);
