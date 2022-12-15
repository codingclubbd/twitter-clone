const getHomePage = require("../../controllers/home/getHomePage");
const htmlResponse = require("../../middlewares/common/htmlResponse");
const loginChecker = require("../../middlewares/common/loginChecker");

const homeRoute = require("express").Router();
require("dotenv").config();

// get Home page
homeRoute.get(
  "/",
  htmlResponse(`Home page - ${process.env.APP_NAME}`),
  loginChecker,
  getHomePage
);

module.exports = homeRoute;
