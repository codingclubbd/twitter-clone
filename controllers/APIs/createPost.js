const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { updateCache } = require("../../utilities/cacheManager");

const createPost = async (req, res, next) => {
  try {
    const tweetObj = {
      content: req.body.content,
      images: [],
      tweetedBy: req.id,
      likes: [],
      retweets: [],
      postData: null,
    };

    [...req.files].forEach((file) => {
      tweetObj.images.push(file.filename);
    });

    const tweet = Tweet(tweetObj);
    const result = await tweet.save();

    await User.populate(result, { path: "tweetedBy", select: "-password" });

    updateCache(`posts:${result._id}`, result);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = createPost;
