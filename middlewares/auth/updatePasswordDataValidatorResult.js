const { validationResult } = require("express-validator");

const updatePasswordDataValidatorResult = (req, res, next) => {
  try {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.render("pages/auth/createNewPassword", {
        error: mappedErrors,
        otp: {
          otpId: req.body.otpId,
          otp: req.body.opt,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = updatePasswordDataValidatorResult;
