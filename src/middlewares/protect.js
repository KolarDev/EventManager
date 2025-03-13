const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");
const AppError = require("./../utils/appError");

// protect routes for logged in users only
const protectRoute = async (req, res, next) => {
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
  const confirmUser = await User.findById(decoded.id);
  if (!confirmUser) {
    return next(
      new AppError("Authentication Failed!, Try logging in again", 401)
    );
  }

  // req.user means the loggedIn User
  req.user = confirmUser;
  next();
};

// Role based access control (RBAC)
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

// restrictTo(["user"]);

module.exports = {
  protectRoute,
  restrictTo,
};
