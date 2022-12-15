const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

const getPostPage = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userJs = JSON.stringify(user);

    return res.render("pages/postPage", {
      user: user ? user : {},
      userJs,
      postId,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = getPostPage;
