const { validationResult } = require("express-validator");

const signInDataValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    try {
      return res.render("pages/auth/signIn", {
        user: req.body ? req.body : {},
        error: mappedErrors,
      });
    } catch (error) {
      throw error;
      console.log(error);
    }
  }
};

module.exports = signInDataValidationResult;
