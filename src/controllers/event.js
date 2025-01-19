const Event = require("./../models/event");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res, next) => {

  // GET USERID FROM REQ
  const { id } = req.user;

  const {
    title, eventDate, category, description, location,
    ticketTypes
  } = req.body;

  try {
    // CHECK IF DATE IS VALID
    const currentTimestamp = Date.now(); // Current timestamp in milliseconds

    // Convert the input date string to a timestamp in milliseconds
    const inputTimestamp = new Date(eventDate).getTime();
    // Compare the two dates
    if (inputTimestamp < currentTimestamp) {
      return next(
        new AppError("Date has passed, choose a valid date", 400)
      );
    }

    // CREATE NEW EVENT
    const newEvent = await Event.create({
      creator: id,
      organizers: [id],
      title,
      eventDate,
      category,
      description,
      location,
      ticketTypes
    });

    res.status(201).json({
      status: "success",
      data: {
        newEvent
      }
    });

  } catch (err) {
    res.status(500).json({
      status: "Failed!",
      message: "Error creating event !"
    });
    console.log(err);
  }

};

// Update event partially (PATCH) only event creator and organisers can update event
const updateEvent = async (req, res, next) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId)

    // CHECK IF EVENT EXISTS
    if (!event) {
      return next(new AppError(
        "Event not found", 404
      ))
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
const getAllEvents = async (req, res) => { 
  const events = await Event.find();


};

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
      data: {
        event
      }
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

    const event = await Event.findById(eventId);
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
