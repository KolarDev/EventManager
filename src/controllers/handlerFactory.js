const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');


exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {};

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const docs = await features.query;


    // ======== RESPONSE
    res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
            data: docs
        }
    });
})