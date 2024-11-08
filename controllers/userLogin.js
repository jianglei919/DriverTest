const bcrypt = require('bcrypt');
const DriverTestInfo = require('../models/DriverTestInfo.js');

module.exports = async (req, res) => {
    const username = req.body.Username;
    const password = req.body.Password;

    console.log('user login username=' + username + ' password=' + password);

    const driverInfo = await DriverTestInfo.findOne({ Username: username });

    console.log('user login driverInfo=' + driverInfo);

    if (driverInfo) {
        bcrypt.compare(password, driverInfo.Password, (error, same) => {
            if (error) {
                console.log(error);
            }
            if (same) {
                console.log('login pass accepted');
                // if passwords match
                // store user session
                req.session.userId = driverInfo._id;
                req.session.driverType = driverInfo.UserType;
                req.session.licenseNo = driverInfo.LicenseNo;
                req.session.driverInfo = driverInfo;
                res.redirect('/');
            } else {
                console.log('login pass unaccepted');
                res.redirect('/auth/login');
            }
        });
    } else {
        res.redirect('/auth/login');
    }
};