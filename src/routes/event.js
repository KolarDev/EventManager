const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  getEventsAround,
} = require("./../controllers/event");

const router = express.Router();

router.use(protectRoute);

module.exports = router;
