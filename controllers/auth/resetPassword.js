const OTP = require("../../models/OTP");
const User = require("../../models/User");
const sendEmail = require("../../utilities/sendEmail");

require("dotenv").config();

const resetPassword = async (req, res, next) => {
  const username = req.body.username;
  try {
    const user = await User.findOne(
      {
        $or: [
          {
            email: username,
          },
          {
            username: username,
          },
        ],
      },
      { email: 1 }
    );

    if (user) {
      const otpObj = new OTP({
        OTP: Math.floor(1000 + Math.random() * 9000),
        email: user.email,
        expireIn: Date.now() + 120010,
      });

      const otp = await otpObj.save();

      await sendEmail(
        [user.email],
        {
          subject: "Reset Your password",
          template: `Your OTP is : ${otp.OTP}`,
          attachments: [],
        },
        function (err, info) {
          if (info?.messageId) {
            res.render("pages/auth/verifyOtp", {
              error: {},
              otp: {
                value: null,
                otpId: otp._id,
                email: user.email,
              },
            });
          } else {
            throw err;
          }
        }
      );
    } else {
      res.render("pages/auth/resetPassword", {
        error: {
          username: {
            msg: "User not found!",
          },
        },
        user: {
          username,
        },
      });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = resetPassword;
