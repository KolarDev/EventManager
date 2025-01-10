const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
} = require("./../controllers/event");

const router = express.Router();

router.use(protectRoute);
router.post("/:id", createEvent);

module.exports = router;
