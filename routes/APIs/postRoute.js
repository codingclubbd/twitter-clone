const createPost = require("../../controllers/APIs/createPost");
const getAllPosts = require("../../controllers/APIs/getAllPosts");
const likeHandler = require("../../controllers/APIs/likeHandler");
const retweetHandler = require("../../controllers/APIs/retweetHandler");
const uploadTweetImage = require("../../middlewares/APIs/uploadTweetImage");
const loginChecker = require("../../middlewares/common/loginChecker");

const postRoute = require("express").Router();
require("dotenv").config();

// get Home page
postRoute.post("/", loginChecker, uploadTweetImage, createPost);

// get all post
postRoute.get("/", loginChecker, getAllPosts);

// post like route
postRoute.put("/like/:id", loginChecker, likeHandler);
postRoute.post("/retweet/:id", loginChecker, retweetHandler);

module.exports = postRoute;
