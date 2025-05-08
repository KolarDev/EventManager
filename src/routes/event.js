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

router.post('/create-event', createEvent);

router.get('/all-events', getAllEvents);
router.get('/events-around/:lat/:lng/:distance', getEventsAround);
router.get('/upcoming', getUpcomingEvents);
router.get('/categories', getCategories);
router.get('/categories/:category', getEventByCategory);

router
  .route('/:eventId')

  .get(getEventById)
  .patch(updateEvent)
  .delete(deleteEvent);

module.exports = router;

/*
/api/v1/events/create-event POST (create an event)
/api/v1/events/all-events GET (get all events)
/api/v1/events/events-around GET (get nearby events )
/api/v1/events/upcoming GET (get upcoming events)
/api/v1/events/categories/:category GET (get all events in a category. replace the :category with the category name)
/api/v1/events/:eventId GET (get a particular event replace the :evenId with the actual event id)
/api/v1/events/:eventId PATCH () (update a particular event replace the :evenId with the actual event id)
/api/v1/events/:eventId DELETE (delete a particular event replace the :evenId with the actual event id)

*/
