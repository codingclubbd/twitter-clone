//dependencies

const createHttpError = require("http-errors");
const User = require("../../models/User");

//email confirmation handler
const emailConfirmation = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          status: "verified",
        },
      }
    );

    if (result) {
      res.render("pages/auth/thankyou", { title: "Thank You" });
    } else {
      throw createHttpError(500, "Internal server error!");
    }
  } catch (error) {
    throw error;
  }
};

//export
module.exports = emailConfirmation;
