const User = require("./../models/user");
const Event = require("./../models/event");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res, next) => {
  // GET USERID from params
  const { id } = req.user
  // CREATE NEW EVENT
  const newEvent = new Event(req.body);

  try {
    newEvent.creator = id
    newEvent.organizers.push(id)

    if (newEvent.Date < new Date()) {
      return next(new AppError(
        "Date has passed, Choose a valid date", 403
      ));
    }
    await newEvent.save()
    res.status(201).json({
      status: "success",
      data: {
        newEvent
      }
    })
  } catch (err) {
    return next(new AppError(
      "Error Creating event", 500
    ));
  }

};

// Update event partially (PATCH) only event creator and organisers can update event
const updateEvent = async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId)

    // CHECK IF EVENT EXISTS
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // CHECK IF USER IS A CREATOR OR ORGANIZER
    const userId = req.user.id
    const isAuthorized = event.creator === userId || event.organizers.includes(userId)

    if (!isAuthorized) {
      return next(new AppError(
        "No access to update", 403
      ));
    }

    await Event.findByIdAndUpdate(
      eventId, { $set: req.body }, { new: true }
    );

    res.status(200).json({
      status: "Success",
      message: 'Event updated successfully!',
      event
    });

  } catch (err) {
    return next(new AppError(
      "Error deleting event", 500
    ));
  }
};

// Get all events
// Option for advanced fitering by categories
const getAllEvents = async (req, res) => { };

// Get an event by ID
const getEventById = async (req, res, next) => {
  const { eventId } = req.params;

  try {
    // FIND EVENT BY ID
    const event = await Event.findById(eventId);

    if (!event) {
      return next(new AppError(
        "Event not found", 404
      ))
    }

    res.status(200).json({
      status: "Success",
      event
    })
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Error getting Event"
    })
  }
};

// Delete event (event can only be deleted if the event date has passed or no one has bought ticket)✍
const deleteEvent = async (req, res, next) => {
  const { eventId } = req.params;

  try {

    const event = await Event.findById(eventId)
    // CHECK IF EVENT EXISTS
    if (!event) {
      return next(new AppError("Event doesnt exist", 404))
    }
    // CHECK IF USER IS A CREATOR OR ORGANIZER
    const userId = req.user.id
    const isAuthorized = event.creator === userId || event.organizers.includes(userId)
    if (!isAuthorized) {
      return next(new AppError("Unauthorized to delete", 403))
    }

    // CHECK IF TODAY'S DATE IS GREATER THAN EVENT'S DATE
    const currentDate = new Date();

    if (currentDate < event.Date) {
      return next(new AppError(
        "Cannot delete event. Event hasnt been done.", 400
      ));
    }

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({
      status: "Success",
      message: "Event deleted successfully"
    })

  } catch (err) {
    return next(new AppError(
      "Error deleting event", 500
    ))
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
