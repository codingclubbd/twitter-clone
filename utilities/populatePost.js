const Tweet = require("../models/Tweet");
const User = require("../models/User");

const populatePost = async (data) => {
  await User.populate(data, { path: "tweetedBy" });
  await Tweet.populate(data, { path: "replayTo" });
  await Tweet.populate(data, { path: "replayTo.tweetedBy" });
};

module.exports = { populatePost };
