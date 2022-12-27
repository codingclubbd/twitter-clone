const Chat = require("../../models/Chat");
const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { updateCache, getAndSetCache } = require("../../utilities/cacheManager");
const { populatePost } = require("../../utilities/populatePost");

const createChat = async (req, res, next) => {
  try {
    const user = await getAndSetCache(`users:${req.id}`, async () => {
      const newData = User.findOne({ _id: req.id });
      return newData;
    });

    const users = req.body;

    users.push(user);

    const chat = Chat({
      chatName: "",
      chatImage: "",
      isGroupChat: true,
      users,
      latestMessage: null,
      activeStatus: false,
    });

    const result = await chat.save();

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = createChat;
