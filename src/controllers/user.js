const User = require("./../models/user");
const Event = require("./../models/event");
const { sendToken } = require("./auth");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signUpUser = catchAsync(async (req, res) => {
  const { fullname, phone, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      fullname,
      phone,
      email,
      password,
      passwordConfirm,
    });

    sendToken(user, 201, res);
});

// Logging user in
const loginUser = catchAsync( async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Provide your email and password!!", 401));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.checkPassword(password, user.password))) {
      return next(new AppError("Invalid Credentials!!", 401));
    }

    sendToken(user, 200, res);
});

// Get User Profile details
const userProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        user
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
  userProfile,
};
