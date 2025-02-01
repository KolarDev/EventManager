const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {
  createEvent,
  updateEvent,
  getAllEvents,
  getCategories,
  getEventById,
  deleteEvent,
} = require("./../controllers/event");

const router = express.Router();

router.use(protectRoute);
router.post("/", createEvent);
router.put("/:eventId", updateEvent);
// getting categories
router.get("/categories", getCategories);
router.get("/:eventId", getEventById);
router.delete("/:eventId", deleteEvent);


module.exports = router;
