const mongoose = require('mongoose');

const EventCategories = [
  'Turfs ground',
  'Wedding Venues',
  'Meeting Venues',
  'Birthday Venues',
  'Pre-wed shoot',
  'Co-working',
  'Casual Party',
  'Concerts',
];

const eventSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    enum: EventCategories,
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
        enum: ['VIP', 'Standard', 'Early Bird'],
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
  Location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: String,
    description: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.index({ Location: '2dsphere' });

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event, EventCategories };
