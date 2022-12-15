const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const likeHandler = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = User.findOne({ _id: req.id });
      return newData;
    });

    const isLiked = user.likes && user.likes.includes(postId);

    const option = isLiked ? "$pull" : "$addToSet";

    // update post likes
    const post = await Tweet.findOneAndUpdate(
      { _id: postId },
      {
        [option]: { likes: userId },
      },
      { new: true }
    );

    await populatePost(post);
    await updateCache(`posts:${postId}`, post);

    // update user likes
    const modifiedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        [option]: { likes: postId },
      },
      { new: true }
    );

    updateCache(`users:${userId}`, modifiedUser);

    res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = likeHandler;
