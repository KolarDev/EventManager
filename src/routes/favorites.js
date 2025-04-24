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
  // #swagger.tags = ['Favourites']
  // #swagger.description = 'User adds event to favourites'
  addToFavorites,
);
router.delete(
  '/remove/:eventId',
  // #swagger.tags = ['Favourites']
  // #swagger.description = 'User removes event from favourites'
  removeFromFavorites,
);

module.exports = router;
