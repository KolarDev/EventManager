const express = require("express");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {} = require("./../controllers/cart");

const router = express.Router();

router.use(protectRoute);

module.exports = router;
