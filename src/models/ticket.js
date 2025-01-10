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
  qrCode: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: { 
    type: String, 
    enum: ['valid', 'used'], 
    default: 'valid'
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
