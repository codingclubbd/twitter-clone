const createHttpError = require("http-errors");
const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const singlePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await getAndSetCache(`posts:${postId}`, async () => {
      const newPost = await Tweet.findOne({ _id: postId });
      await populatePost(newPost);
      return newPost;
    });

    res.json(post);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal server error!"));
  }
};

module.exports = singlePost;
