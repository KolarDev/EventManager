const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Concerts", "Wedding", "Podcast"],
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  location: {
    type: String,
    required: true,
  },
  ticketTypes: [
    {
      type: {
        type: String,
        enum: ["VIP", "Standard", "Early Bird"],
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
