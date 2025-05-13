const { Favorite } = require('../models/cart');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Add events to favourites
const addToFavorites = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  let favorites = await Favorite.findOne({ user: userId });

  if (!favorites) {
    // SAVE USER AND EVENT TO FAVORITES
    await Favorite.create({ user: userId, events: [eventId] });
  } else {
    // CHECK IF EVENT IS ALREADY IN FAVORITES
    if (!favorites.events.includes(eventId)) {
      favorites.events.push(eventId);
      await favorites.save();
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'Event is already saved to favorites',
      });
    }
  }

  // Find the updates user favourite events
  favorites = await Favorite.findOne({ user: userId });

  res.status(200).json({
    status: 'success',
    data: {
      favorites,
    },
  });
});

// Remove events from favourites
const removeFromFavorites = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const favorites = await Favorite.findOne({ user: userId });

  if (favorites) {
    const checkEventExists = favorites.events
      .map((objectId) => objectId.toString())
      .includes(eventId);

    if (checkEventExists) {
      // ==== FIND AND COMPARE EVENTID
      const eventIndex = favorites.events.findIndex(
        (item) => item.toString() === eventId,
      );

      if (eventIndex !== -1) {
        favorites.events.splice(eventIndex, 1);
        await favorites.save();
      }
    } else {
      // ERROR IF EVENTS DOESNT EXIST IN FAVORITES
      throw new AppError('Event isnt in favorites', 401);
    }
  } else {
    return new AppError("You don't have a favorites", 404);
  }

  const updatedFavorites = await Favorite.findOne({ user: userId });
  res.status(200).json({
    status: 'success',
    data: {
      updatedFavorites,
    },
  });
});

module.exports = {
  addToFavorites,
  removeFromFavorites,
};

// Add an email updates about favourite events
// 1. Create a function to send and email to users about some updates on their favourite event
// 2. Add the function to a cron job to run every 6 hours
//    to check for events that are close
//      Later we will use websockets real-time update instead of a cron job
// 3. The function goes through all the favourites document and event in them,
//      checks if there is an event that about to happen
//      or tickets is closing soon or any other vital information.
// 4. Generate dynamically different email write ups for each cases.
// 5. Send neccessary email notification to the prospective user
