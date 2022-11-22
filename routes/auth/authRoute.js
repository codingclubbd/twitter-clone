// Dependencies
const { Router } = require("express");
const dotenv = require("dotenv");

const htmlResponse = require("../../middlewares/common/htmlResponse");
const avatarUpload = require("../../middlewares/auth/avatarUpload");
const { check } = require("express-validator");
const User = require("../../models/User");
const signUpDataValidator = require("../../middlewares/auth/signUpDataValidator");
const signUpDataValidationResult = require("../../middlewares/auth/signUpDataValidationResult");
const getSignIn = require("../../controllers/auth/getSignIn");
const getSignUp = require("../../controllers/auth/getSignUp");
const signupController = require("../../controllers/auth/signupController");
const emailConfirmation = require("../../controllers/auth/confirmation");
const signInController = require("../../controllers/auth/signInController");
const signInDataValidator = require("../../middlewares/auth/signInDataValidator");
const signInDataValidationResult = require("../../middlewares/auth/signInDataValidationResult");
const loginChecker = require("../../middlewares/common/loginChecker");
const logout = require("../../controllers/auth/logout");
const getResetPasswordPage = require("../../controllers/auth/getResetPasswordPage");
const resetPassword = require("../../controllers/auth/resetPassword");
const verifyOTP = require("../../controllers/auth/verifyOTP");
const updatePasswordDataValidators = require("../../middlewares/auth/updatePasswordDataValidators");
const updatePasswordDataValidatorResult = require("../../middlewares/auth/updatePasswordDataValidatorResult");
const updatePassword = require("../../controllers/auth/updatePassword");

// Router
const router = Router();

// App Initialization and Config
dotenv.config();

// Get Sign In Page
router.get(
  "/signIn",
  htmlResponse(`signIn - ${process.env.APP_NAME}`),
  loginChecker,
  getSignIn
);

router.post(
  "/signIn",
  htmlResponse(`signIn - ${process.env.APP_NAME}`),
  signInDataValidator(),
  signInDataValidationResult,
  signInController
);

// Get Sign Up Page
router.get(
  "/signup",
  htmlResponse(`SignUp - ${process.env.APP_NAME}`),
  loginChecker,
  getSignUp
);

// Post Sign Up Page Controller
router.post(
  "/signup",
  htmlResponse(`Signup - ${process.env.APP_NAME}`),
  avatarUpload,
  signUpDataValidator(),
  signUpDataValidationResult,
  signupController
);

// email confirmation
router.get("/emailConfirmation/:id", emailConfirmation);

// logout
router.get("/logout", logout);

// password recovery ==================================

// forgot password page
router.get(
  "/resetPassword",
  htmlResponse(`Reset Password - ${process.env.APP_NAME}`),
  getResetPasswordPage
);

// forgot password handler
router.post(
  "/resetPassword",
  htmlResponse(`Reset Password - ${process.env.APP_NAME}`),
  resetPassword
);

router.post(
  "/otpVerification",
  htmlResponse(`Verify OTP - ${process.env.APP_NAME}`),
  verifyOTP
);

router.post(
  "/createNewPassword",
  htmlResponse(`Create New Password - ${process.env.APP_NAME}`),
  updatePasswordDataValidators,
  updatePasswordDataValidatorResult,
  updatePassword
);

// Module Export
module.exports = router;
