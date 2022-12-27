const getUsers = require("../../controllers/APIs/getUsers");
const loginChecker = require("../../middlewares/common/loginChecker");

const usersRoute = require("express").Router();
require("dotenv").config();

// get Home page
usersRoute.get("/", loginChecker, getUsers);

module.exports = usersRoute;
