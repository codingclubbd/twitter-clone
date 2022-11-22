//dependencies

//forget password page handler
const getResetPasswordPage = (req, res) => {
  try {
    res.render("pages/auth/resetPassword", { error: {}, user: {} });
  } catch (error) {
    throw error;
  }
};

//export
module.exports = getResetPasswordPage;
