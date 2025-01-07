const express = require("express");
const User = require("../models/user");
const { protectRoute, restrictTo } = require("../middlewares/protect");
const {
  signUpUser,
  loginUser,
  userProfile,
} = require("../controllers/userController");

const {
  sendToken,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);

router.use(protectRoute(User));

router.get("/profile", userProfile);

module.exports = router;
