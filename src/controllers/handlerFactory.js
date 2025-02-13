const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getCategories = (Model) =>
  catchAsync(async (req, res, next) => {
    const categories = await Model.distinct("category");

    let events = [];
    if (req.query.category) {
      const category = new APIFeatures(
        Model.find({ category: req.query.category }),
        req.query
      )
        .sort()
        .limitFields()
        .paginate();

      events = await category.query;
    }

    const responseData = { status: "success", data: { categories } };

    // Check events length
    if (events.length) {
      responseData.data.categories = undefined;
      responseData.data.events = events;
    }

    res.status(200).json(responseData);
  });
