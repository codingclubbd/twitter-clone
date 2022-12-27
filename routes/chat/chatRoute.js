const createChat = require("../../controllers/APIs/createChat");
const getAllChat = require("../../controllers/APIs/getAllChat");
const getAllPosts = require("../../controllers/APIs/getAllPosts");
const getSingleChat = require("../../controllers/APIs/getSingleChat");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginChecker = require("../../middlewares/common/loginChecker");

const chatRoute = require("express").Router();
require("dotenv").config();

// get Home page
chatRoute.post("/", loginChecker, createChat);
chatRoute.get("/", loginChecker, getAllChat);
chatRoute.get("/:chatId", loginChecker, getSingleChat);

module.exports = chatRoute;
