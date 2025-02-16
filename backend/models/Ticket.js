const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ticketSchema = new mongoose.Schema({
  ticket_id: { type: Number },
  subject: { type: String, required: true },
  description: { type: String, default: "" },
  user_id: { type: Number, required: true },
  agent_id: { type: Number, default: null },
  category: { type: String, enum: ["IT", "HR", "Admin"], default: "" }, // Added category field
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true, default: "" }, // Set default to empty string
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
  attachments: [
    {
      fileName: { type: String },
      fileUrl: { type: String }, // Path to the uploaded file
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ticketSchema.plugin(AutoIncrement, { inc_field: "ticket_id" });

module.exports = mongoose.model("Ticket", ticketSchema);
