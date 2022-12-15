const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache, updateCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const replayHandler = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.id;
    const files = req.files;
    const content = req.body.content;

    const postData = {
      content,
      images: [],
      tweetedBy: userId,
      likes: [],
      retweetUsers: [],
      postData: null,
      replayTo: postId,
      replayedPosts: [],
    };

    files.forEach((file) => {
      postData.images.push(file.filename);
    });

    const postObj = await Tweet(postData).save();

    const post = await Tweet.findByIdAndUpdate(
      postId,
      {
        $addToSet: { replayedPosts: postObj._id },
      },
      { new: true }
    );

    await populatePost(post);
    await populatePost(postObj);

    await updateCache(`posts:${postId}`, post);
    await updateCache(`posts:${postObj._id}`, postObj);

    return res.json(postObj);
  } catch (error) {
    next(error);
  }
};

module.exports = replayHandler;
