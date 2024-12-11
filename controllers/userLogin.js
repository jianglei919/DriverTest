const bcrypt = require('bcrypt');
const DriverTestInfo = require('../models/DriverTestInfo.js');
const AppointmentInfo = require('../models/AppointmentInfo.js');

module.exports = async (req, res) => {
    try {
        const username = req.body.Username;
        const password = req.body.Password;

        console.log('user login username=' + username + ' password=' + password);

        const driverInfo = await DriverTestInfo.findOne({ Username: username });

        console.log('user login driverInfo=' + driverInfo);

        if (driverInfo) {
            let appointmentInfo = {_id: null, date: null, time: null};
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
            req.flash('validationErrors', [`User Not Found, Please Sign Up`]);
            req.flash('data', req.body);
            res.redirect('/auth/signUp');
        }
    } catch (error) {
        console.error('Error processing login: ', error);
        req.flash('validationErrors', ['Error processing login request !']);
    }
};