const User = require("./../models/user");
const Event = require("./../models/event");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res) => {};

// Update event partially (PATCH)
const updateEvent = async (req, res) => {};

// Get all events
// Option for advanced fitering by categories
const getAllEvents = async (req, res) => {};

// Get an event by ID
const getEventById = async (req, res) => {};

// Delete event (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = async (req, res) => {};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
