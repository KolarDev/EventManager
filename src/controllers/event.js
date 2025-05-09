const Event = require('./../models/event');
const axios = require('axios');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// =============== CREATE EVENT
const createEvent = catchAsync(async (req, res, next) => {
  // GET USERID FROM REQ
  const { userId } = req.user;

  const { title, eventDate, category, description, Location, ticketTypes } =
    req.body;

  // CHECK IF DATE IS VALID
  const currentTimestamp = Date.now(); // Current timestamp in milliseconds

  // Convert the input date string to a timestamp in milliseconds
  const inputTimestamp = new Date(eventDate).getTime();
  // Compare the two dates
  if (inputTimestamp < currentTimestamp) {
    return next(new AppError('Date has passed, choose a valid date', 400));
  }

  // CREATE NEW EVENT
  const newEvent = await Event.create({
    creator: userId,
    organizers: [userId],
    title,
    eventDate,
    category,
    description,
    Location,
    ticketTypes,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newEvent,
    },
  });
});

// ============== UPDATE EVENT PARTIALLY (PATCH) only event creator and organisers can update event
const updateEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);

  // CHECK IF EVENT EXISTS
  if (!event) {
    return next(new AppError('Event not found', 404));
  }
  // CHECK IF USER IS A CREATOR OR ORGANIZER
  const userId = req.user.id;
  const isAuthorized =
    event.creator === userId || event.organizers.includes(userId);

  if (!isAuthorized) {
    return next(new AppError('No access to update', 403));
  }

  await Event.findByIdAndUpdate(eventId, { $set: req.body }, { new: true });

  res.status(200).json({
    status: 'Success',
    message: 'Event updated successfully!',
    event,
  });
});

// ============ GET ALL EVENTS
// Option for advanced fitering by categories
const getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find();

  res.status(200).json({
    status: 'success',
    data: {
      events,
    },
  });
});

// ========== GET ALL CATEGORIES or CATEGORY
const getCategories = factory.getCategories(Event);

// ======
const getEventByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;

  // Find events based on category
  const events = await Event.find({ category });

  if (!events) {
    return next(new AppError('No event found for this category', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      events,
    },
  });
});

// ============== GET EVENT BY ID
const getEventById = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  // FIND EVENT BY ID
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      event,
    },
  });
});

// Upload or update event image
const uploadEventImage = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("Event not found", 404));

  if (!req.files || req.files.length === 0) {
    return next(new AppError("No image uploaded", 400));
  }

  // Append new image URLs
  const imageUrls = req.files.map((file) => file.path);
  event.images.push(...imageUrls);
  await event.save();

  res.status(200).json({
    status: "success",
    message: "Image uploaded successfully",
    images: event.images,
  });
});

// ============== DELETE EVENT (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  // CHECK IF EVENT EXISTS
  if (!event) {
    return next(new AppError('Event doesnt exist', 404));
  }
  // CHECK IF USER IS A CREATOR OR ORGANIZER
  const userId = req.user.id;
  const isAuthorized =
    event.creator === userId || event.organizers.includes(userId);
  if (!isAuthorized) {
    return next(new AppError('Unauthorized to delete', 403));
  }

  // CHECK IF TODAY'S DATE IS GREATER THAN EVENT'S DATE
  const currentDate = new Date();

  if (currentDate < event.Date) {
    return next(
      new AppError('Cannot delete event. Event is still active.', 400),
    );
  }

  await Event.findByIdAndDelete(eventId);
  res.status(200).json({
    status: 'Success',
    message: 'Event deleted successfully',
  });
});

// ============== GET EVENTS AROUND USER LOCATION
const getEventsAround = catchAsync(async (req, res, next) => {
  const { lat, lng, distance } = req.params;

  if (!lat || !lng || !distance) {
    // Get user ip address
    const clientIp = req.ip === '::1' ? '8.8.8.8' : req.ip;

    // Get user location from IP
    const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    console.log(geoResponse);
    const { lat, lon: lng, status } = geoResponse.data;
    const distance = 500000000000;

    if (status !== 'success') {
      return next(new AppError('Unable to determine location', 500));
    }
  }

  // Fetch nearby events
  const events = await Event.find({
    Location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseFloat(distance) * 1000,
      },
    },
  });

  if (!events) {
    return next(new AppError('No event around your location', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      events,
    },
  });
});

// ============== GET UPCOMING EVENTS
const getUpcomingEvents = catchAsync(async (req, res, next) => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the date one month from now
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(currentDate.getFullYear() + 1);

  // Fetch events that are less than a month from now
  const upcomingEvents = await Event.find({
    eventDate: {
      $gt: currentDate,
      $lt: oneYearFromNow,
    },
  });

  // console.log(upcomingEvents);

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return next(new AppError('No events found within the next month', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      upcomingEvents,
    },
  });
});

module.exports = {
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
};
