const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketType: {
    type: String,
    enum: ['VIP', 'Standard', 'Early Bird'],
    required: true
  },
  qrcode: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
