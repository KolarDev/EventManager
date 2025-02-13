const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
},
{ timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

// ================== FAVORITES SCHEMA
const favoriteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
}, {
  timestamps: true
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

// =============
module.exports = {
  Cart,
  Favorite,
};
