const getUsers = require("../../controllers/APIs/getUsers");
const getPostSearch = require("../../controllers/search/getPostSearch");
const getUserSearch = require("../../controllers/search/getUserSearch");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginChecker = require("../../middlewares/common/loginChecker");

const searchRoute = require("express").Router();
require("dotenv").config();

// get Home page
searchRoute.get(
  "/",
  htmlResponse(`Search Page - ${process.env.APP_NAME}`),
  loginChecker,
  getPostSearch
);
// get Home page
searchRoute.get(
  "/users",
  htmlResponse(`Search Page - ${process.env.APP_NAME}`),
  loginChecker,
  getUserSearch
);

module.exports = searchRoute;
