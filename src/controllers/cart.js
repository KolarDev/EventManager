const User = require("./../models/user");
const Event = require("./../models/event");
const { Cart } = require("./../models/cart");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


// Users add event to cart
const addToCart = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    // ADD USER AND EVENT TO CART
    await Cart.create({ user: userId, events: [eventId] });
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


// ========= USERS REMOVE EVENTS FROM CART 
const removeFromCart = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id
  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    // CHECK IF EVENT EXISTS
    const checkEventExists = cart.events.map(objectId => objectId.toString()).includes(eventId);

    if(checkEventExists) {
      // ==== FIND AND COMPARE EVENTID
      const eventIndex = cart.events.findIndex((item) => item.toString() === eventId);

      if (eventIndex !== -1) {
        cart.events.splice(eventIndex, 1);
        await cart.save();
      }
    } else {
      // ERROR IF EVENTS DOESNT EXIST IN CART
      throw new AppError("Event isnt in cart", 401);
    }
  } else {
    return new AppError("You don't have a cart", 404);
  }

  const updatedCart = await Cart.findOne({ user: userId })
  res.status(200).json({
    status: "success",
    data: {
      updatedCart,
    },
  });

});

module.exports = {
  addToCart,
  removeFromCart,
};
