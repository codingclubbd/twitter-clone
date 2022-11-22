//dependencies
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const OTP = require("../../models/OTP");
require("dotenv").config();

// otp handler
const verifyOTP = async (req, res) => {
  try {
    const otpInput = req.body?.otp;
    const otpId = req.body?.otpId;
    const otpObj = await OTP.findOne({ _id: otpId });

    if (
      Number(otpInput) === otpObj.OTP &&
      otpObj?.expireIn.getTime() > Date.now()
    ) {
      const result = await OTP.findOneAndUpdate(
        { _id: otpObj._id },
        {
          $set: {
            status: true,
          },
        }
      );

      if (result) {
        res.render("pages/auth/createNewPassword", {
          error: {},
          user: {},
          otp: {
            otpId: result._id,
            otp: result.OTP,
          },
        });
      } else {
        throw createHttpError(500, "Internal Server error!");
      }
    } else {
      const errMsg =
        otpObj?.expireIn.getTime() > Date.now() ? "Invalid OTP" : "Expired OTP";
      res.render("pages/auth/verifyOtp", {
        error: {
          otp: { msg: errMsg },
        },
        otp: {
          value: otpInput,
          otpId: otpId,
          email: otpObj.email,
        },
      });
    }
  } catch (err) {
    res.render("pages/auth/verifyOtp", {
      error: {
        otp: { msg: "Invalid OTP" },
      },
      otp: {
        value: otpInput,
        token: otpId,
        email: otpObj.email,
      },
    });
  }
};

//export
module.exports = verifyOTP;
