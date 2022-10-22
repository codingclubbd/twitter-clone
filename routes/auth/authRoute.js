// Dependencies
const { Router } = require("express");
const dotenv = require("dotenv");
const {
  getSignIn,
  getSignUp,
  signupController,
} = require("../../controllers/auth/authControllers");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const avatarUpload = require("../../middlewares/auth/avatarUpload");
const { check } = require("express-validator");
const User = require("../../models/User");
const signUpDataValidator = require("../../middlewares/auth/signUpDataValidator");
const signUpDataValidationResult = require("../../middlewares/auth/signUpDataValidationResult");

// Router
const router = Router();

// App Initialization and Config
dotenv.config();

// Get Sign In Page
router.get(
  "/signin",
  htmlResponse(`SignIn - ${process.env.APP_NAME}`),
  getSignIn
);

// Get Sign Up Page
router.get(
  "/signup",
  htmlResponse(`SignUp - ${process.env.APP_NAME}`),
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

// Module Export
module.exports = router;
