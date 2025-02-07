const { Favorite } = require("../models/cart");
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

})

module.exports = {
    addToFavorites, 
    removeFromFavorites
}