const DriverTestInfo = require("../models/DriverTestInfo.js");

module.exports = async (req, res, next) => {
  if (loggedIn == null) {
    return res.redirect("/");
  }

  const driverInfo = await DriverTestInfo.findById(req.session.userId);

  if (!driverInfo) {
    return res.redirect("/");
  }
  next();
};
