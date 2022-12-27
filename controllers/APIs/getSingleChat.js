const { default: mongoose } = require("mongoose");
const Chat = require("../../models/Chat");
const Tweet = require("../../models/Tweet");
const User = require("../../models/User");
const { getAndSetCache } = require("../../utilities/cacheManager");

// creating post
const getSingleChat = async (req, res, next) => {
  try {
    const userId = req.id;
    const chatId = req.params.chatId;

    if (!mongoose.isValidObjectId(chatId)) {
      return res.status(400).json({
        error: "Chat doesn't exist",
      });
    } else {
      console.log(mongoose.isValidObjectId(chatId));

      const result = await Chat.findOne({
        _id: chatId,
        users: {
          $elemMatch: {
            $eq: userId,
          },
        },
      });
      await User.populate(result, { path: "users" });

      if (!result) {
        // check ChatId is a UserId
        const userFound = await User.findById(chatId);
        if (userFound) {
          const chatData = await Chat.findOneAndUpdate(
            {
              isGroupChat: false,
              users: {
                $size: 2,
                $all: [
                  {
                    $elemMatch: {
                      $eq: mongoose.Types.ObjectId(chatId),
                    },
                  },
                  {
                    $elemMatch: {
                      $eq: mongoose.Types.ObjectId(userId),
                    },
                  },
                ],
              },
            },
            {
              $setOnInsert: {
                users: [userId, chatId],
              },
            },
            {
              new: true,
              upsert: true,
            }
          ).populate("users");

          if (chatData) {
            return res.json(chatData);
          } else {
            return res.status(400).json({
              error: "Something went wrong!",
            });
          }
        } else {
          return res.status(400).json({
            error: "Chat is doesn't exist or you don't have access to it",
          });
        }
      }

      // WILL ADD LOTS OF LOGIC
      return res.json(result);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getSingleChat;
