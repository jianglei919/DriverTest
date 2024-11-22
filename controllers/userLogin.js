const bcrypt = require('bcrypt');
const DriverTestInfo = require('../models/DriverTestInfo.js');
const AppointmentInfo = require('../models/AppointmentInfo.js');

module.exports = async (req, res) => {
    const username = req.body.Username;
    const password = req.body.Password;

    console.log('user login username=' + username + ' password=' + password);

    const driverInfo = await DriverTestInfo.findOne({ Username: username });

    console.log('user login driverInfo=' + driverInfo);

    if (driverInfo) {
        let appointmentInfo = {_id: null, date: null, time: null};
        if (driverInfo.AppointmentId) {
            let existAppointmentInfo = await AppointmentInfo.findById(driverInfo.AppointmentId);
            if (existAppointmentInfo) {
                appointmentInfo = existAppointmentInfo;
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
                req.session.driverType = driverInfo.UserType;
                req.session.licenseNo = driverInfo.LicenseNo;
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
        res.redirect('/auth/login');
    }
};