const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

const getChatPage = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;

    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userJs = JSON.stringify(user);

    return res.render("pages/message/chat", {
      user: user ? user : {},
      userJs,
      chatId,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = getChatPage;
