const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

const getMessagesPage = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userJs = JSON.stringify(user);

    return res.render("pages/message/message", {
      user: user ? user : {},
      userJs,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = getMessagesPage;
