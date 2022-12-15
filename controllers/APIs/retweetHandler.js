const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const retweetHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const deletedPost = await Tweet.findOneAndDelete({
      tweetedBy: userId,
      postData: postId,
    });

    let = retweetObj = deletedPost;

    if (retweetObj === null) {
      const tweet = Tweet({
        tweetedBy: userId,
        postData: postId,
      });
      retweetObj = await tweet.save();
      await populatePost(tweet);
      await updateCache(`posts:${retweetObj._id}`, tweet);
    }

    const option = deletedPost !== null ? "$pull" : "$addToSet";

    // update post likes
    const post = await Tweet.findOneAndUpdate(
      { _id: postId },
      {
        [option]: { retweetUsers: userId },
      },
      { new: true }
    );
    await populatePost(post);
    updateCache(`posts:${postId}`, post);

    // update user likes
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        [option]: { retweets: postId },
      },
      { new: true }
    );

    updateCache(`users:${userId}`, modifiedUser);

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = retweetHandler;
