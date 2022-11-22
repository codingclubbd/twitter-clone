const Tweet = require("../../models/Tweet");
const User = require("../../models/User");

// creating post
const getAllPosts = async (req, res, next) => {
  try {
    const result = await Tweet.find();
    await User.populate(result, { path: "tweetedBy", select: "-password" });
    await User.populate(result, { path: "postData" });
    await User.populate(result, { path: "postData.tweetedBy" });
    // WILL ADD LOTS OF LOGIC
    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllPosts;
