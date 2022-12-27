const Tweet = require("../../models/Tweet");
const User = require("../../models/User");

// creating post
const getUsers = async (req, res, next) => {
  try {
    let filterObj = {};

    // search post
    let searchText = req.query.searchText;
    if (searchText) {
      filterObj = {
        $or: [
          { firstName: { $regex: new RegExp(searchText, "ig") } },
          { lastName: { $regex: new RegExp(searchText, "ig") } },
          { username: { $regex: new RegExp(searchText, "ig") } },
          { email: searchText },
        ],
      };
    }

    const result = await User.find(filterObj);

    return res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getUsers;
