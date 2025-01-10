const User = require("./../models/user");
const Event = require("./../models/event");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res, next) => {
  // GET USERID from params
  const { id } = req.params;
  // CREATE NEW EVENT
  const newEvent = new Event(req.body);
  
  try {
    newEvent.creator = id
    newEvent.organizers = [id]
    await newEvent.save()
    res.status(201).json({
      status: "success",
      data :{
        newEvent
      }
    })
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Error creating event !"
    })
  }

};

// Update event partially (PATCH) only event creator and organisers can update event
const updateEvent = async (req, res) => {
  
};

// Get all events
// Option for advanced fitering by categories
const getAllEvents = async (req, res) => {};

// Get an event by ID
const getEventById = async (req, res) => {};

// Delete event (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = async (req, res, next) => {};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
