const { Favorite } = require("../models/cart");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");



const addToFavorites = catchAsync(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;

    let favorites = await Favorite.findOne({ user: userId });

    if (!favorites) {
        // ADD USER AND EVENT TO FAVORITES
        await Favorite.create({ user: userId, events: [eventId] });
    } else {
        // CHECK IF EVENT IS ALREADY IN FAVORITES
        if (!favorites.events.includes(eventId)) {
            favorites.events.push(eventId);
            await favorites.save();
        } else {
            return res.status(200).json({
                status: "success",
                message: "Event is already in favorites"
            });
        }
    }

    favorites = await Favorite.findOne({ user: userId });


    res.status(200).json({
        status: "success",
        data: {
            favorites
        },
    });

})


const removeFromFavorites = catchAsync(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id
    const favorites = await Favorite.findOne({ user: userId });

    if (favorites) {
        const checkEventExists = favorites.events.map(objectId => objectId.toString()).includes(eventId);
        
        if(checkEventExists) {
            // ==== FIND AND COMPARE EVENTID
            const eventIndex = favorites.events.findIndex((item) => item.toString() === eventId);
      
            if (eventIndex !== -1) {
              favorites.events.splice(eventIndex, 1);
              await favorites.save();
            }
          } else {
            // ERROR IF EVENTS DOESNT EXIST IN FAVORITES
            throw new AppError("Event isnt in favorites", 401);
          }
    } else {
        return new AppError("You don't have a favorites", 404);
    }

    const updatedFavorites = await Favorite.findOne({ user: userId })
    res.status(200).json({
        status: "success",
        data: {
            updatedFavorites,
        },
    });
})

module.exports = {
    addToFavorites,
    removeFromFavorites
}