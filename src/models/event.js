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
  eventDate: {
    type: Date,
    default: Date.now,
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
      sold: {
        type: Number,
        default: 0,
      },
    },
  ],
  Location: [
    {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tourSchema.index({ Location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
