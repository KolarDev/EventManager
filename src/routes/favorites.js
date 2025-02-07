const express = require("express");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const { addToCart, removeFromCart } = require("./../controllers/cart");
const { addToFavorites } = require("../controllers/favorites");

const router = express.Router();

router.use(protectRoute);

router.post("/add/:eventId", addToFavorites);
router.delete("/remove/:eventId", removeToFavorites);

module.exports = router;
