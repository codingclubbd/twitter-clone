const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");

const followHandler = async (req, res, next) => {
  try {
    const followingUserId = req.params.id;
    const loggedInUserId = req.id;

    const user = await getAndSetCache(`users:${loggedInUserId}`, async () => {
      const newData = User.findOne({ _id: loggedInUserId });
      return newData;
    });

    const isFollowing =
      user.following && user.following.includes(followingUserId);

    const option = isFollowing ? "$pull" : "$addToSet";

    // update user likes
    const modifiedLoggedInUser = await User.findOneAndUpdate(
      { _id: loggedInUserId },
      {
        [option]: { following: followingUserId },
      },
      { new: true }
    );

    updateCache(`users:${loggedInUserId}`, modifiedLoggedInUser);

    // update user likes
    const modifiedFollowingUser = await User.findOneAndUpdate(
      { _id: followingUserId },
      {
        [option]: { followers: loggedInUserId },
      },
      { new: true }
    );

    updateCache(`users:${followingUserId}`, modifiedFollowingUser);

    res.json(modifiedFollowingUser);
  } catch (error) {
    next(error);
  }
};

module.exports = followHandler;
