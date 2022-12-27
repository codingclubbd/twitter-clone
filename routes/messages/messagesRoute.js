const getUsers = require("../../controllers/APIs/getUsers");
const getChatPage = require("../../controllers/message/getChatPage");
const getMessagesPage = require("../../controllers/message/getMessagesPage");
const getNewMessagePage = require("../../controllers/message/getNewMessagePage");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginChecker = require("../../middlewares/common/loginChecker");

const messagesRoute = require("express").Router();
require("dotenv").config();

// get Home page
messagesRoute.get(
  "/",
  htmlResponse(`Message Page - ${process.env.APP_NAME}`),
  loginChecker,
  getMessagesPage
);
// get Home page
messagesRoute.get(
  "/new",
  htmlResponse(`New Massage Page - ${process.env.APP_NAME}`),
  loginChecker,
  getNewMessagePage
);
// get Home page
messagesRoute.get(
  "/:chatId",
  htmlResponse(`New Massage Page - ${process.env.APP_NAME}`),
  loginChecker,
  getChatPage
);

module.exports = messagesRoute;
