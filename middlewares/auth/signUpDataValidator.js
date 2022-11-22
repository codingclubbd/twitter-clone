const { check } = require("express-validator");
const User = require("../../models/User");

const signUpDataValidator = () => {
  return [
    // first name
    check("firstName").trim().notEmpty().withMessage("First name is required!"),
    // last name
    check("lastName").trim().notEmpty().withMessage("Last name is required!"),
    // username
    check("username")
      .trim()
      .notEmpty()
      .withMessage("username is required!")
      .custom(async (val, { req }) => {
        try {
          const user = await User.findOne({ username: val }, { username: 1 });

          if (user) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (error) {
          throw error;
        }
      })
      .withMessage("username is already in use")
      .toLowerCase()
      .isLength({ min: 5 })
      .withMessage("username must be at least 3 characters"),
    //email
    check("email")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Email is required!")
      .isEmail()
      .withMessage("Email is invalid!")
      .custom(async (val, { req }) => {
        try {
          const user = await User.findOne({ email: val }, { email: 1 });

          if (user) {
            return Promise.reject();
          } else {
            return Promise.resolve();
          }
        } catch (error) {
          throw error;
        }
      })
      .withMessage("Email is already in use"),

    //password
    check("password")
      .notEmpty()
      .withMessage("Password is required!")
      .isStrongPassword()
      .withMessage("Password should be strong!"),
    //Confirm password
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required!")
      .isStrongPassword()
      .withMessage("Password should be strong!")
      .custom((val, { req }) => {
        const pass = req.body.password;

        if (val === pass) {
          return true;
        } else {
          return false;
        }
      })
      .withMessage("Password doesn't match!"),
  ];
};

module.exports = signUpDataValidator;
