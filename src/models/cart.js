const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
