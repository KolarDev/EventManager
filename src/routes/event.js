const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {} = require("./../controllers/event");



const router = express.Router();


router.use(protectRoute(User));


module.exports = router;
