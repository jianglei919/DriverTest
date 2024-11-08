const DriverTestInfo = require('../models/DriverTestInfo.js');

module.exports = async (req, res, next) => {
  const driverInfo = await DriverTestInfo.findById(req.session.userId);

  if (!driverInfo) return res.redirect('/');
  next();
};
