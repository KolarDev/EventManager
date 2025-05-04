const express = require('express');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const {
  addToFavorites,
  removeFromFavorites,
} = require('../controllers/favorites');

const router = express.Router();

router.use(protectRoute);

router.post(
  '/add/:eventId',
  addToFavorites,
);
router.delete(
  '/remove/:eventId',

  removeFromFavorites,
);

module.exports = router;
