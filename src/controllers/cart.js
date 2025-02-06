const User = require("./../models/user");
const Event = require("./../models/event");
const Cart = require("./../models/cart");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


// Users add event to cart
const addToCart = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // ADD USER AND EVENT TO CART
    await Cart.create({ user: req.user.id, events: [eventId] });
  } else {
    // CHECK IF EVENT IS ALREADY IN CART
    if (!cart.events.includes(eventId)) {
      cart.events.push(eventId);
      await cart.save();
    } else {
      return res.status(200).json({ 
        status: "success", 
        message: "Event is already in the cart" 
      });
    }
  }

  cart = await Cart.findOne({ user: userId });

  
  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });

});

const removeFromCart = catchAsync(async (req, res) => {

  const { eventId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    // Find the array index of the eventId
    const eventIndex = cart.events.findIndex((item) => item === eventId);
    // if the event is present, remove it from the array of events in the cart
    if (eventIndex === -1) {
      cart.events.splice(eventIndex, 1);
    } else {
      return new AppError("event is not in your cart!", 401);
    }
  } else {
    return new AppError("You don't have event in your cart", 401);
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });

});

module.exports = {
  addToCart,
  removeFromCart,
};
