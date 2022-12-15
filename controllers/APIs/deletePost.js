const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { deleteCache, updateCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.id;

    // delete the post.
    const deletedPost = await Tweet.findOneAndDelete({
      _id: postId,
      tweetedBy: userId,
    });

    await deleteCache(`posts:${deletedPost._id}`);

    // remove this post id from the replayedPosts array of the main post.
    if (deletedPost?.replayTo) {
      const replayToPost = await Tweet.findByIdAndUpdate(
        deletedPost.replayTo,
        {
          $pull: { replayedPosts: postId },
        },
        { new: true }
      );
      if (replayToPost !== null) {
        await populatePost(replayToPost);
        await updateCache(`posts:${replayToPost?._id}`, replayToPost);
      }
    }

    // delete the user id from retweetedUsers array of the main post if the post is a retweeted post and have postData.
    if (deletedPost?.postData) {
      const retweetedPost = await Tweet.findByIdAndUpdate(
        deletedPost?.postData,
        {
          $pull: { retweetUsers: userId },
        },
        {
          new: true,
        }
      );
      await populatePost(retweetedPost);

      await updateCache(`posts:${retweetedPost._id}`, retweetedPost);
    }

    // delete postId from the retweets array of users who retweet this post.
    if (deletedPost?.retweetUsers?.length) {
      deletedPost?.retweetUsers?.forEach(async (uId) => {
        const user = await User.findByIdAndUpdate(
          uId,
          {
            $pull: {
              retweets: deletedPost._id,
            },
          },
          { new: true }
        );
        await updateCache(`users:${user._id}`, user);
      });
    }

    console.log(deletedPost?.retweetUsers);
    // delete all retweeted post.
    if (deletedPost?.retweetUsers?.length) {
      console.log("deletedRetweetedPost");
      deletedPost?.retweetUsers?.forEach(async (uId) => {
        const deletedRetweetedPost = await Tweet.findOneAndDelete({
          postData: deletedPost._id,
          tweetedBy: uId,
        });

        await deleteCache(`posts:${deletedRetweetedPost._id}`);
      });
    }

    //  remove postId from the likes array of users who like this post.
    if (deletedPost?.likes?.length) {
      deletedPost?.likes?.forEach(async (userId) => {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $pull: {
              likes: deletedPost._id,
            },
          },
          { new: true }
        );
        await updateCache(`users:${user._id}`, user);
      });
    }

    return res.json(deletedPost);
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
