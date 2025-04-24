const express = require('express');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const { addToCart, removeFromCart } = require('./../controllers/cart');

const router = express.Router();

router.use(protectRoute);

router.post(
  '/add/:eventId',
  // #swagger.tags = ['Carts']
  // #swagger.description = 'User adds event to cart'
  addToCart,
);
router.delete(
  '/remove/:eventId',
  // #swagger.tags = ['Carts']
  // #swagger.description = 'User removes event from cart'
  removeFromCart,
);

module.exports = router;
