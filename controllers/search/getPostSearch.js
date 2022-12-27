const createHttpError = require("http-errors");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

const getPostSearch = async (req, res, next) => {
  try {

    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newUser = await User.findOne({ _id: req.id });
      return newUser;
    });


    const userJs = JSON.stringify(user);

    return res.render("pages/search/search", {
      user: user ? user : {},
      userJs,
      tab: "posts",
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = getPostSearch;
