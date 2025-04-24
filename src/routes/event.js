const express = require('express');
const User = require('../models/user');
const { protectRoute, restrictTo } = require('../middlewares/protect');
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
} = require('./../controllers/event');

const router = express.Router();

router.use(protectRoute);
router.post(
  '/create-event',
  // #swagger.tags = ['Events']
  // #swagger.description = 'User creates an event'
  createEvent,
);

router.get(
  '/all-events',
  // #swagger.tags = ['Events']
  // #swagger.description = 'Fetch all active events'
  getAllEvents,
);
router.get(
  '/events-around',
  // #swagger.tags = ['Events']
  // #swagger.description = 'User gets all events around his location'
  getEventsAround,
);
router.get(
  '/upcoming',
  // #swagger.tags = ['Events']
  // #swagger.description = 'User gets upcoming events'
  getUpcomingEvents,
);
router.get(
  '/categories',
  // #swagger.tags = ['Events']
  // #swagger.description = 'user gets categories of event'
  getCategories,
);
router.get(
  '/categories/:category',
  // #swagger.tags = ['Events']
  // #swagger.description = 'User gets event by categories'
  getEventByCategory,
);

router
  .route('/:eventId')
  // #swagger.tags = ['Events']
  // #swagger.description = 'User gets an event by ID'
  .get(getEventById)
  // #swagger.tags = ['Events']
  // #swagger.description = 'User updates an event [restricted to event organizers only]'
  .patch(updateEvent)
  // #swagger.tags = ['Events']
  // #swagger.description = 'User deletes an event [restricted to event organizers only]'
  .delete(deleteEvent);

module.exports = router;
