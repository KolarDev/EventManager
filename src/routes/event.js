const express = require('express');
const User = require('../models/user');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const createUpload = require('../middlewares/upload');
const {
  createEvent,
  updateEvent,
  getAllEvents,
  getCategories,
  getEventById,
  deleteEvent,
  getEventsAround,
  getUpcomingEvents,
  getEventByCategory,
  uploadEventImage
} = require('./../controllers/event');

const router = express.Router();

router.use(protectRoute);

router.post('/create-event', createEvent);

router.get('/all-events', getAllEvents);
router.get('/events-around/:lat/:lng/:distance', getEventsAround);
router.get('/upcoming', getUpcomingEvents);
router.get('/categories', getCategories);
router.get('/categories/:category', getEventByCategory);

// Upload and update event image
const eventUpload = createUpload("event-images");
router.patch(
  "/:id/upload-images",
  protectRoute,
  eventUpload.array("images", 5),
  uploadEventImage
);

router
  .route('/:eventId')

  .get(getEventById)
  .patch(updateEvent)
  .delete(deleteEvent);

module.exports = router;


