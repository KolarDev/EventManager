const Event = require("./../models/event");
const axios = require("axios");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

// =============== CREATE EVENT
const createEvent = catchAsync(async (req, res, next) => {
  // GET USERID FROM REQ
  const { id } = req.user;

  const { title, eventDate, category, description, Location, ticketTypes } =
    req.body;

  // CHECK IF DATE IS VALID
  const currentTimestamp = Date.now(); // Current timestamp in milliseconds

  // Convert the input date string to a timestamp in milliseconds
  const inputTimestamp = new Date(eventDate).getTime();
  // Compare the two dates
  if (inputTimestamp < currentTimestamp) {
    return next(new AppError("Date has passed, choose a valid date", 400));
  }

  // CREATE NEW EVENT
  const newEvent = await Event.create({
    creator: id,
    organizers: [id],
    title,
    eventDate,
    category,
    description,
    Location,
    ticketTypes,
  });

  res.status(201).json({
    status: "success",
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
    return next(new AppError("Event not found", 404));
  }
  // CHECK IF USER IS A CREATOR OR ORGANIZER
  const userId = req.user.id;
  const isAuthorized =
    event.creator === userId || event.organizers.includes(userId);

  if (!isAuthorized) {
    return next(new AppError("No access to update", 403));
  }

  await Event.findByIdAndUpdate(eventId, { $set: req.body }, { new: true });

  res.status(200).json({
    status: "Success",
    message: "Event updated successfully!",
    event,
  });
});

// ============ GET ALL EVENTS
// Option for advanced fitering by categories
const getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find();

  res.status(200).json({ 
    status: "success",
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
    return next(new AppError("No event found for this category", 404));
  }

  res.status(200).json({
    status: "Success",
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
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      event,
    },
  });
});

// ============== DELETE EVENT (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  // CHECK IF EVENT EXISTS
  if (!event) {
    return next(new AppError("Event doesnt exist", 404));
  }
  // CHECK IF USER IS A CREATOR OR ORGANIZER
  const userId = req.user.id;
  const isAuthorized =
    event.creator === userId || event.organizers.includes(userId);
  if (!isAuthorized) {
    return next(new AppError("Unauthorized to delete", 403));
  }

  // CHECK IF TODAY'S DATE IS GREATER THAN EVENT'S DATE
  const currentDate = new Date();

  if (currentDate < event.Date) {
    return next(
      new AppError("Cannot delete event. Event hasnt been done.", 400)
    );
  }

  await Event.findByIdAndDelete(eventId);
  res.status(200).json({
    status: "Success",
    message: "Event deleted successfully",
  });
});

// ============== GET EVENTS AROUND USER LOCATION
const getEventsAround = catchAsync(async (req, res, next) => {
  // Get user ip address
  const clientIp = req.ip === "::1" ? "8.8.8.8" : req.ip;

  // Get user location from IP
  const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
  console.log(geoResponse);
  const { lat, lon, status } = geoResponse.data;

  if (status !== "success") {
    return next(new AppError("Unable to determine location", 500));
  }

  // Fetch nearby events
  const events = await Event.find({
    Location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat],
        },
        $maxDistance: 5000, // 5km radius
      },
    },
  });

  if (!events) {
    return next(new AppError("No event around your location", 404));
  }

  res.status(200).json({
    status: "success",
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
  const oneMonthFromNow = new Date(currentDate);
  oneMonthFromNow.setDate(1);
  oneMonthFromNow.setMonth(currentDate.getMonth() + 2);

  // Fetch events that are less than a month from now
  const upcomingEvents = await Event.find({
    eventDate: {
      $gt: currentDate,
      $lt: oneMonthFromNow,
    },
  });

  console.log(upcomingEvents)

  if (!upcomingEvents || upcomingEvents.length === 0) {
    return next(new AppError("No events found within the next month", 404));
  }

  const upcomingEventsInfo = upcomingEvents.map(event => {
    return {
      date: event.eventDate,
      title: event.title,
      address: event.Location.address,
    }
  })

  res.status(200).json({
    status: "success",
    data: {
      events: upcomingEventsInfo
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
};
