const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Schema for storing ticket attachments
const ticketAttachmentSchema = new mongoose.Schema({
  ticket_id: { type: Number, required: true }, // ID of the related ticket
  file_url: { type: String, required: true }, // URL where the file is stored
  file_name: { type: String, required: true }, // Original file name
  uploaded_at: { type: Date, default: Date.now }, // Timestamp of file upload
});

// Auto-increment for attachment_id (unique ID for each attachment)
ticketAttachmentSchema.plugin(AutoIncrement, { inc_field: "attachment_id" });

module.exports = mongoose.model("TicketAttachment", ticketAttachmentSchema);
