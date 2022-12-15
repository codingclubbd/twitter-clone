const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const pinHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.id;

    let post = await getAndSetCache(`posts:${postId}`, async () => {
      const newData = await Tweet.findOne({ _id: postId });
      return newData;
    });

    console.log(post.pinned)
    if (post.pinned) {
      post = await Tweet.findOneAndUpdate(
        { tweetedBy: userId, _id: postId },
        { $set: { pinned: false } },
        {new:true}
      );

      if (post) {
        await populatePost(post);
        await updateCache(`posts:${post._id}`, post);
      }
    } else {
      const previousPinnedPost = await Tweet.findOneAndUpdate(
        { tweetedBy: userId, pinned: true },
        { $set: { pinned: false } },
        {new:true}
      );



      if (previousPinnedPost) {
        await populatePost(previousPinnedPost);
        await updateCache(
          `posts:${previousPinnedPost._id}`,
          previousPinnedPost
        );
      }

      post = await Tweet.findOneAndUpdate(
        { tweetedBy: userId, _id: postId },
        { $set: { pinned: true } },
        {new:true}
      );

      if (post) {
        await populatePost(post);
        await updateCache(`posts:${post._id}`, post);
      }
    }

    await populatePost(post);

    res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = pinHandler;
