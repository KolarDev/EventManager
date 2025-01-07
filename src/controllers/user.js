const User = require("./../models/user");
const Hostel = require("./../models/hostel");
const Cart = require("./../models/cart");
const { sendToken } = require("./authController");
const AppError = require("./../utils/appError");

const signUpUser = async (req, res) => {
  const { firstname, othername, phone, email, password, passwordConfirm } =
    req.body;

  try {
    const user = await User.create({
      fullname,
      phone,
      email,
      password,
      passwordConfirm,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      status: "failed !",
      message: "Error creating your account !",
    });
    console.log(error);
  }
};

// Logging user in
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Provide your email and password!!", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new AppError("Invalid Credentials!!", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "failed !",
      message: "Error logging in !",
    });
    console.log(error);
  }
};

// Get User Profile details
const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        firstname: user.username,
        othername: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed!",
      message: "Error fetching user data !",
    });
    //console.log(error);
  }
};


module.exports = {
  signUpUser,
  loginUser,
  userProfile
};
