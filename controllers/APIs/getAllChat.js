const Chat = require("../../models/Chat");
const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

// creating post
const getAllChat = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = User.findOne({ _id: req.id });
      return newData;
    });

    const filterObj = {};

    filterObj.users = { $elemMatch: { $eq: user._id } };

    const result = await Chat.find(filterObj).sort({ updatedAt: "-1" });
    await User.populate(result, { path: "users" });

    // WILL ADD LOTS OF LOGIC
    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getAllChat;
