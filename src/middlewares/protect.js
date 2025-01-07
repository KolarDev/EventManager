const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const protectRoute = (user) => {
  return async (req, res, next) => {
    // Get the token from the authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // If there is no token.It means the user is not logged in
    if (!token) return next(new AppError("Please login to get access!", 401));

    // Verifying the token. Server verifies by test signature
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const confirmUser = await user.findById(decoded.id);
    if (!confirmUser) {
      return next(
        new AppError("Authentication Failed!, Try logging in again", 401)
      );
    }

    // req.user means the loggedIn User
    req.user = confirmUser;
    next();
  };
};

// Role based access control
const restrictTo = (...roles) => {
  // ...roles stands for array to be passed into the function
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permissin to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = {
  protectRoute,
  restrictTo,
};
