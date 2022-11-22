const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signInController = async (req, res, next) => {
  try {
    if (req.validUser) {
      const token = await jwt.sign(
        {
          username: req.username,
          email: req.email,
          _id: req.id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200);
      res.cookie("access_token", "Bearer " + token, { signed: true });

      res.redirect("/");
    } else {
      res.send("Something went wrong!");
    }
  } catch (error) {
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = signInController;
