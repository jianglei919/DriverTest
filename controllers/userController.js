const bcrypt = require('bcrypt');
const DriverTestInfo = require('../models/DriverTestInfo.js');
const AppointmentInfo = require('../models/AppointmentInfo.js');

module.exports = {

    routeSignUp: (req, res) => {
        var username = '';
        var password = '';
        const data = req.flash('data')[0];

        if (typeof data != "undefined") {
            username = data.Username;
            password = data.Password;
            console.log('signUp request param: ', { username, password });
        }

        res.render('signUp', {
            errors: req.flash('validationErrors'),
            username: username,
            password: password,
        });
    },

    userSignUp: async (req, res) => {
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
    },

    routeLogin: (req, res) => {
        var username = '';
        const data = req.flash('data')[0];

        if (typeof data != "undefined") {
            username = data.Username;
        }
        res.render('login', {
            errors: req.flash('validationErrors'),
            username: username,
        });
    },

    userLogin: async (req, res) => {
        try {
            const username = req.body.Username;
            const password = req.body.Password;

            console.log('user login username=' + username + ' password=' + password);

            const driverInfo = await DriverTestInfo.findOne({ Username: username });

            console.log('user login driverInfo=' + driverInfo);

            if (driverInfo) {
                let appointmentInfo = { _id: null, date: null, time: null };
                if (driverInfo.AppointmentId) {
                    const currentDateTime = new Date().toISOString();
                    let existAppointmentInfo = await AppointmentInfo.findById(driverInfo.AppointmentId);
                    if (existAppointmentInfo) {
                        if (driverInfo.TestResult == 'FAIL') {
                            var date = existAppointmentInfo.date;
                            var time = existAppointmentInfo.time;
                            const appointmentDateTime = new Date(`${date}T${time}`);
                            if (appointmentDateTime < new Date(currentDateTime)) {
                                //考试失败了，预约日期过期了，清空预约信息，方便重新预约
                                driverInfo.AppointmentId = null;
                                await DriverTestInfo.findByIdAndUpdate(driverInfo);
                            } else {
                                appointmentInfo = existAppointmentInfo;
                            }
                        } else {
                            appointmentInfo = existAppointmentInfo;
                        }
                    }
                }

                bcrypt.compare(password, driverInfo.Password, (error, same) => {
                    if (error) {
                        console.log(error);
                    }
                    if (same) {
                        console.log('login pass accepted');
                        // if passwords match
                        // store user session
                        req.session.userId = driverInfo._id;
                        req.session.driverInfo = driverInfo;
                        req.session.appointmentInfo = appointmentInfo;
                        res.redirect('/');
                    } else {
                        console.log('login pass unaccepted');
                        req.flash('validationErrors', [`Password wrong`]);
                        req.flash('data', req.body);
                        res.redirect('/auth/login');
                    }
                });
            } else {
                req.flash('validationErrors', [`User Not Found, Please Sign Up`]);
                req.flash('data', req.body);
                res.redirect('/auth/signUp');
            }
        } catch (error) {
            console.error('Error processing login: ', error);
            req.flash('validationErrors', ['Error processing login request !']);
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
};