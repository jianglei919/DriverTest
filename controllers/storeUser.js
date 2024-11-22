const DriverTestInfo = require('../models/DriverTestInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        console.log("SignUp page start.");

        const newDriver = new DriverTestInfo(req.body);

        //checked twice password
        if (req.body.Password2 != newDriver.Password) {
            req.flash('validationErrors', [`Inconsistent password input twice password1: ${newDriver.Password}, password2: ${req.body.Password2}`]);
            req.flash('data', req.body);
            return res.redirect('/auth/signUp');
        }

        //checked Username unique
        let existDriverInfo = await DriverTestInfo.findOne({ Username: newDriver.Username });
        if (existDriverInfo) {
            req.flash('validationErrors', [`Username already exists for : ${newDriver.Username}`]);
            req.flash('data', req.body);
            return res.redirect('/auth/signUp');
        }

        //checked LicenseNo & UserType unique
        existDriverInfo = await DriverTestInfo.findOne({ LicenseNo: newDriver.LicenseNo, UserType: newDriver.UserType });
        if (existDriverInfo) {
            req.flash('validationErrors', [`LicenseNo already exists for : ${newDriver.LicenseNo}`]);
            req.flash('data', req.body);
            return res.redirect('/auth/signUp');
        }

        const saveResult = await DriverTestInfo.create(newDriver);

        console.log("Store User. saveResult=" + saveResult);
    } catch (error) {
        console.log("Store User Error: " + error);
        if (error.code === 11000) {
            const duplicateKey = JSON.stringify(error.keyValue);
            req.flash('validationErrors', [`Duplicate entry detected: ${duplicateKey}`]);
        } else {
            const validationErrors = Object.keys(error.errors || {}).map(
                (key) => error.errors[key]?.message || 'Unknown error'
            );
            req.flash('validationErrors', validationErrors);
        }
        req.flash('data', req.body);
        return res.redirect('/auth/signUp');
    }
    res.redirect('/auth/login');
};
