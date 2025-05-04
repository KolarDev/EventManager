const express = require('express');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const { addToCart, removeFromCart } = require('./../controllers/cart');

const router = express.Router();

router.use(protectRoute);

router.post(
  '/add/:eventId',

  addToCart,
);
router.delete(
  '/remove/:eventId',

  removeFromCart,
);

module.exports = router;
