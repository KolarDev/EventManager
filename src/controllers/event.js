const User = require("./../models/user");
const Event = require("./../models/event");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res) => {};

// Update event partially (PATCH) only event creator and organisers can update event
const updateEvent = async (req, res) => {};

// Get all events
// Option for advanced fitering by categories
const getAllEvents = async (req, res) => {};

// Get an event by ID
const getEventById = async (req, res) => {};

// Delete event (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = async (req, res, next) => {};

const getEventsAround = catchAsync(async (req, res, next) => {
  const clientIp = req.ip === "::1" ? "8.8.8.8" : req.ip;

  // Get user location from IP
  const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
  const { lat, lon, status } = geoResponse.data;

  if (status !== "success") {
    return next(new AppError("Unable to determine location", 500));
  }

  // Fetch nearby events
  const events = await Event.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lon, lat],
        },
        $maxDistance: 5000, // 5km radius
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: {
      events,
    },
  });
});

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  getEventsAround,
};
