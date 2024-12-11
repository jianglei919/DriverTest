const DriverTestInfo = require('../models/DriverTestInfo.js');

module.exports = async (req, res) => {
    try {
        console.log("SignUp page start.");

        const newDriver = new DriverTestInfo(req.body);

        // Save form data for re-populating fields on validation errors
        req.flash('data', req.body);

        // Check for password consistency
        if (req.body.Password2 !== newDriver.Password) {
            req.flash('validationErrors', [`Passwords do not match: password1: ${newDriver.Password}, password2: ${req.body.Password2}`]);
            return res.redirect('/auth/signUp');
        }

        // Check Username uniqueness
        const existingUsername = await DriverTestInfo.findOne({ Username: newDriver.Username });
        if (existingUsername) {
            req.flash('validationErrors', [`Username already exists for: ${newDriver.Username}`]);
            return res.redirect('/auth/signUp');
        }

        // Handle different UserType registration logic
        if (newDriver.UserType === 'Driver') {
            // Allow multiple 'Driver' registrations but only one 'default' LicenseNo
            const existingDriver = await DriverTestInfo.findOne({ LicenseNo: newDriver.LicenseNo, UserType: 'Driver' });
            if (existingDriver && newDriver.LicenseNo !== 'default') {
                req.flash('validationErrors', [`LicenseNo already exists for Driver: ${newDriver.LicenseNo}`]);
                return res.redirect('/auth/signUp');
            }
        } else if (newDriver.UserType === 'Examiner') {
            // Allow multiple Examiner registrations (no restrictions)
            console.log("Registering Examiner user.");
        } else if (newDriver.UserType === 'Admin') {
            // Allow only one Admin registration
            const existingAdmin = await DriverTestInfo.findOne({ UserType: 'Admin' });
            if (existingAdmin) {
                req.flash('validationErrors', ['An Admin account already exists.']);
                return res.redirect('/auth/login');
            }
        } else {
            req.flash('validationErrors', [`Invalid UserType: ${newDriver.UserType}`]);
            return res.redirect('/auth/signUp');
        }

        // Save the new user
        const saveResult = await DriverTestInfo.create(newDriver);
        console.log("User registered successfully. saveResult=", saveResult);

    } catch (error) {
        console.error("SignUp Error: ", error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const duplicateKey = JSON.stringify(error.keyValue);
            req.flash('validationErrors', [`Duplicate entry detected: ${duplicateKey}`]);
        } else {
            const validationErrors = Object.keys(error.errors || {}).map(
                (key) => error.errors[key]?.message || 'Unknown error'
            );
            req.flash('validationErrors', validationErrors);
        }
        return res.redirect('/auth/signUp');
    }

    res.redirect('/auth/login');
};