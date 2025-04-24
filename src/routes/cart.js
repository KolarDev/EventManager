const express = require('express');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const { addToCart, removeFromCart } = require('./../controllers/cart');

const router = express.Router();

router.use(protectRoute);

router.post(
  '/add/:eventId',
  // #swagger.tags = ['Carts']
  // #swagger.description = ''
  addToCart,
);
router.delete(
  '/remove/:eventId',
  // #swagger.tags = ['Carts']
  // #swagger.description = ''
  removeFromCart,
);

module.exports = router;
