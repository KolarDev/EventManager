const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  eventcreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
  organisers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  title: String,
  venue: String,
  price: Number,
  description: String,
  images: [String],
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
