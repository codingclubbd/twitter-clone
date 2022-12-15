const followHandler = require("../../controllers/APIs/followHandler");
const updateAvatar = require("../../controllers/APIs/updateAvatar");
const getFollowers = require("../../controllers/follow/getFollowers");
const getFollowing = require("../../controllers/follow/getFollowing");
const getPosts = require("../../controllers/profile/getPosts");
const getReplies = require("../../controllers/profile/getReplies");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginChecker = require("../../middlewares/common/loginChecker");
const upload = require("multer-uploader");
const updateAvatarImage = require("../../middlewares/APIs/updateAvatarImage");
const updateCoverImage = require("../../middlewares/APIs/updateCoverImage");
const updateCover = require("../../controllers/APIs/updateCover");

const profileRoute = require("express").Router();
require("dotenv").config();

// get Home page
profileRoute.get(
  "/:username",
  htmlResponse(`Profile Page - ${process.env.APP_NAME}`),
  loginChecker,
  getPosts
);
// get Home page
profileRoute.get(
  "/:username/replies",
  htmlResponse(`Profile Page - ${process.env.APP_NAME}`),
  loginChecker,
  getReplies
);
// get Home page
profileRoute.get(
  "/:username/followers",
  htmlResponse(`Profile Page - ${process.env.APP_NAME}`),
  loginChecker,
  getFollowers
);
// get Home page
profileRoute.get(
  "/:username/following",
  htmlResponse(`Profile Page - ${process.env.APP_NAME}`),
  loginChecker,
  getFollowing
);
// get Home page
profileRoute.put("/:id/follow", loginChecker, followHandler);
profileRoute.post("/avatar", loginChecker, updateAvatarImage, updateAvatar);
profileRoute.post("/cover", loginChecker, updateCoverImage, updateCover);

module.exports = profileRoute;
