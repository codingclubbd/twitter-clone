const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");

const updateAvatar = async (req, res, next) => {
  try {
    const filename = req?.files[0].filename;
    const user = await User.findByIdAndUpdate(
      req.id,
      {
        avatarProfile: filename,
      },
      { new: true }
    );

    await updateCache(`users:${user._id}`, user);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = updateAvatar;
