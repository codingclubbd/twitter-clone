const createHttpError = require("http-errors");
const OTP = require("../../models/OTP");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const hashString = require("../../utilities/hashString");
require("dotenv").config();

const updatePassword = async (req, res, next) => {
  try {
    const otpId = req.body.otpId;
    const otp = req.body.otp;
    const password = req.password;

    const otpObj = await OTP.findOne({ _id: otpId });

    if (Number(otp) === otpObj.OTP && otpObj.status) {
      const hashedPassword = await hashString(password);
      const result = await User.findOneAndUpdate(
        { email: otpObj.email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      if (result) {
        const token = await jwt.sign(
          {
            username: result.username,
            email: result.email,
            _id: result._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.status(200);
        res.cookie("access_token", "Bearer " + token, { signed: true });

        res.redirect("/");
      } else {
        throw createHttpError(500, "Internal Server error");
      }
    } else {
      throw createHttpError(500, "Internal Server error");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = updatePassword;
