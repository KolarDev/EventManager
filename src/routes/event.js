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
  // #swagger.description = ''
  createEvent,
);

router.get(
  '/all-events',
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  getAllEvents,
);
router.get(
  '/events-around',
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  getEventsAround,
);
router.get(
  '/upcoming',
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  getUpcomingEvents,
);
router.get(
  '/categories',
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  getCategories,
);
router.get(
  '/categories/:category',
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  getEventByCategory,
);

router
  .route('/:eventId')
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  .get(getEventById)
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  .patch(updateEvent)
  // #swagger.tags = ['Events']
  // #swagger.description = ''
  .delete(deleteEvent);

module.exports = router;
