// Get Sign In Page
const getSignIn = (req, res, next) => {
  try {
    res.render("pages/auth/signIn", { error: {}, user: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = getSignIn;
