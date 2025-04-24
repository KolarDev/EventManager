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
  // #swagger.tags = ['Auths']
  // #swagger.description = 'User registers an account'
  signUpUser,
);
router.post(
  '/login',
  // #swagger.tags = ['Auths']
  // #swagger.description = 'User login to his account'
  loginUser,
);

// Google OAuth login route
router.get(
  '/google',
  // #swagger.tags = ['Auths']
  // #swagger.description = 'User login with google'
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  // #swagger.tags = ['Auths']
  // #swagger.description = 'Google authentication'
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
  // #swagger.tags = ['Users']
  // #swagger.description = 'User get profile details'
  userProfile,
);

router.use(restrictTo(''));
router.get(
  '/all-users',
  // #swagger.tags = ['Users']
  // #swagger.description = 'Get a list of all users'
  getAllUsers,
);

module.exports = router;
