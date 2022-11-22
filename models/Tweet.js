//dependencies
const mongoose = require("mongoose");

// Tweet schema
const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
    tweetedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    postData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  {
    timestamps: true,
  }
);

// model
const Tweet = mongoose.model("Tweet", tweetSchema);

// exports
module.exports = Tweet;
