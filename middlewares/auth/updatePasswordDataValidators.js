const { check } = require("express-validator");

const updatePasswordDataValidators = [
  check("password")
    .isStrongPassword()
    .withMessage("Password is not strong enough!")
    .custom((val, { req }) => {
      req.password = val;
      return true;
    }),

  check("confirmPassword")
    .custom((val, { req }) => {
      const password = req.password;
      if (val === password) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Password doesn't match!"),
];

module.exports = updatePasswordDataValidators;
