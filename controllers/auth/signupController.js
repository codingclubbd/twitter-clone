const createHttpError = require("http-errors");
const User = require("../../models/User");
const hashString = require("../../utilities/hashString");
const sendEmail = require("../../utilities/sendEmail");
const fs = require("fs");
const path = require("path");

const signupController = async (req, res, next) => {
  // handle error
  if (Object.keys(req.error ? req.error : {}).length !== 0) {
    return res.render("pages/auth/signup", {
      user: req.body,
      error: req.error,
    });
  } else {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = await hashString(req.body.password);
    const avatarProfile = req.file?.filename || "";

    const userObj = User({
      firstName,
      lastName,
      username,
      email,
      password,
      avatarProfile,
      status: "unverified",
      likes: [],
      retweetUsers: [],
    });

    const user = await userObj.save();

    if (req.file?.filename) {
      fs.mkdirSync(path.resolve(__dirname ,
        `./../../public/uploads/${user._id}/profile/`));
      fs.renameSync(
        path.resolve(__dirname , `./../../temp/${req.file?.filename}`),
        path.resolve(__dirname ,
          `./../../public/uploads/${user._id}/profile/${req.file?.filename}`)
      );
    }

    if (user._id) {
      sendEmail(
        [user.email],
        {
          subject: "Verify Your Account",
          template: `Verification link:${process.env.APP_URL}/emailConfirmation/${user._id}`,
          attachments: [],
        },
        (err, info) => {
          if (!err && info) {
            return res.render("pages/auth/confirmation", {
              email: user.email,
              title: `Confirmation - ${process.env.APP_NAME}`,
            });
          } else {
            next(createHttpError(500, "Internal server error!"));
          }
        }
      );
    }
  }
};

module.exports = signupController;
