const User = require("./../models/user");
const Event = require("./../models/event");
const AppError = require("./../utils/appError");

// Create an event
const createEvent = async (req, res) => {
  // GET USERID from params
  const { id } = req.user
  // CREATE NEW EVENT
  const newEvent = new Event(req.body);

  try {
    newEvent.creator = id
    newEvent.organizers = [id]

    if(newEvent.Date < new Date()) {
      res.status(403).json({
        status: "Failed",
        message: "Date has passed, Choose a valid date"
      })
    }
    await newEvent.save()
    res.status(201).json({
      status: "success",
      data: {
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
  const { eventId } = req.params;
  try {
    const event = await Event.findByIdAndUpdate(
      eventId, { $set: req.body }, { new: true }
    )

    // CHECK IF EVENT EXISTS
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // CHECK IF USER IS A CREATOR OR ORGANIZER\
    const userId =  req.user.id
    const isAuthorized = event.creator === userId || event.organizers.includes(userId)

    if (!isAuthorized) {
      return res.status(403).json({ message: 'No access to update' });
    }

    res.status(200).json({
      status: "Success",
      message: 'Event updated successfully!',
      event
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Error updating event"
    })
  }
};

// Get all events
// Option for advanced fitering by categories
const getAllEvents = async (req, res) => { };

// Get an event by ID
const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    // FIND EVENT BY ID
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json("Event not found")
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
    if(!isAuthorized) {
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
    res.status(500).json({
      status: "Failed",
      message: "Error Deleting Event"
    })
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
};
