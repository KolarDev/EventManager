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
    console.log(req)
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
  const { eventId, userId } = req.params
  
  try {
    const event = await Event.findByIdAndUpdate(
      eventId, { $set: req.body } , { new: true }
    )

    // CHECK IF EVENT EXISTS
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // CHECK IF USER IS A CREATOR OR ORGANIZER
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
