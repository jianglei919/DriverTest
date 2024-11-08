module.exports = (req, res) => {
  var username = ""
  var password = ""
  const data = req.flash('data')[0];
  if (typeof data != "undefined") {
    username = data.Username;
    password = data.Password
  }

  res.render('SignUp', {
    errors: req.flash('validationErrors'),
    username: username,
    password: password
  });
};  