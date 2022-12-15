const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

// creating post
const getAllPosts = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = User.findOne({ _id: req.id });
      return newData;
    });

    const filterObj = {};

    req.query.tweetedBy && (filterObj.tweetedBy = req.query?.tweetedBy);
    req.query.replyTo &&
      (filterObj.replayTo =
        req.query?.replyTo == "false" ? { $exists: false } : { $exists: true });

    user.following = user.following || [];

    const followingUsers = [...user.following];
    followingUsers.push(user._id);

    req.query.followingOnly &&
      req.query.followingOnly == "true" &&
      (filterObj.tweetedBy = { $in: followingUsers });

      req.query.pinned &&  req.query.pinned == "true" && (filterObj.pinned = true)

    const result = await Tweet.find(filterObj);
    await User.populate(result, { path: "tweetedBy", select: "-password" });
    await Tweet.populate(result, { path: "postData" });
    await Tweet.populate(result, { path: "replayTo" });
    await User.populate(result, { path: "replayTo.tweetedBy" });
    await User.populate(result, { path: "replayedPosts" });
    await User.populate(result, { path: "postData.tweetedBy" });
    // WILL ADD LOTS OF LOGIC
    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllPosts;
