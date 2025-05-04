const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const { protectRoute, restrictTo } = require('../middlewares/protect');
const {
  signUpUser,
  loginUser,
  userProfile,
  getAllUsers,
} = require('../controllers/user');

const {
  sendToken,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth');

const router = express.Router();

// User Authentication routes
router.post(
  '/signup',

  signUpUser,
);
router.post(
  '/login',

  loginUser,
);

// Google OAuth login route
router.get(
  '/google',

  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),

  (req, res) => {
    // Return JWT token after successful authentication
    res.json({
      message: 'Login successful',
      user: req.user.user,
      token: req.user.token,
    });
  },
);

router.use(protectRoute);

router.get(
  '/profile',

  userProfile,
);

router.use(restrictTo('admin'));
router.get(
  '/all-users',

  getAllUsers,
);

module.exports = router;
