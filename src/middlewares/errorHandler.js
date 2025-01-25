const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(.*?[^\\])\1/)[0];
  // console.log(value);
  const message = `Duplicate Field value: ${value} Please use another value`;
  return new AppError(message, 404);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 404);
};

const handleJwtErrorDB = () => {
  return new AppError("Invalid token, Please login again", 401);
};

const handleJwtExpiredErrorDB = () => {
  return new AppError("Token Expired!, Please login again", 401);
};

const sendErrorDev = (err, req, res) => {
  // In API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};


const sendErrorProd = (err, req, res) => {
  // A) API ERRORS
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status || "error",
        message: err.message || "An error occurred.",
      });
    }

    // Log the error for debugging
    console.error("ERROR 💥", err);

    // Send a generic message for unexpected errors
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE ERRORS (For web pages)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: "Something went wrong!",
      msg: err.message || "An error occurred. Please try again.",
    });
  }

  // Log error and send generic error response
  console.error("ERROR 💥", err);

  return res.status(500).json({
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};


module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidatorErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJwtErrorDB();
    if (error.name === "TokenExpiredError") error = handleJwtExpiredErrorDB();

    sendErrorProd(error, req, res);
  }
};
