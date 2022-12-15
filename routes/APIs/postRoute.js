const createPost = require("../../controllers/APIs/createPost");
const deletePost = require("../../controllers/APIs/deletePost");
const getAllPosts = require("../../controllers/APIs/getAllPosts");
const likeHandler = require("../../controllers/APIs/likeHandler");
const pinHandler = require("../../controllers/APIs/pinHandler");
const replayHandler = require("../../controllers/APIs/replayHandler");
const retweetHandler = require("../../controllers/APIs/retweetHandler");
const getPostPage = require("../../controllers/postPage/postPage");
const singlePost = require("../../controllers/postPage/signlePost");
const uploadTweetImage = require("../../middlewares/APIs/uploadTweetImage");
const loginChecker = require("../../middlewares/common/loginChecker");

const postRoute = require("express").Router();
require("dotenv").config();

// get Home page
postRoute.post("/", loginChecker, uploadTweetImage, createPost);

// get all post
postRoute.get("/", loginChecker, getAllPosts);
postRoute.get("/:postId", loginChecker, getPostPage);
postRoute.delete("/:postId", loginChecker, deletePost);
postRoute.put("/:postId/pin", loginChecker, pinHandler);
postRoute.get("/single/:postId", loginChecker, singlePost);

// post like route
postRoute.put("/like/:id", loginChecker, likeHandler);
postRoute.post("/retweet/:id", loginChecker, retweetHandler);
postRoute.post(
  "/replay/:postId",
  loginChecker,
  uploadTweetImage,
  replayHandler
);

module.exports = postRoute;
