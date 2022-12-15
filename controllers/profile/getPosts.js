const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

const getPosts = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });

    const userProfile = await User.findOne({ username: username });

    const userJs = JSON.stringify(user);
    const profileUserJs = JSON.stringify(userProfile);

    return res.render("pages/profile/profile", {
      user: user ? user : {},
      userJs,
      userProfile,
      profileUserJs,
      tab: "posts",
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = getPosts;
