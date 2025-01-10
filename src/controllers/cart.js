const User = require("./../models/user");
const Event = require("./../models/event");
const Cart = require("./../models/cart");
const AppError = require("./../utils/appError");


// Users add event to cart
const addToCart = async (req, res) => {
  const { eventId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.events.push(eventId);
    } else {
      await Cart.create({ user: req.user.id, events: [eventId] });
    }

    res.status(200).json({
      status: "success",
      data: {
        cart,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed!",
      message: "Error adding event to cart !",
    });
    //console.log(error);
  }
};

const removeFromCart = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "Failed!",
      message: "Error deleting event from your cart !",
    });
    //console.log(error);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
};
