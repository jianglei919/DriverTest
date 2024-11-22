const DriverTestInfo = require('../models/DriverTestInfo.js');
const AppointmentInfo = require('../models/AppointmentInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const _id = req.session.userId;
        console.log("G2 page start. _id=" + _id);

        const oldDriverInfo = await DriverTestInfo.findById(_id);
        if (!oldDriverInfo) {
            res.redirect('/');
            console.log("G2 page not find by _id=" + _id);
            return;
        }

        const reqDriverInfo = new DriverTestInfo(req.body);

        const newDriver = {
            car_details: {
                make: reqDriverInfo.car_details.make,
                model: reqDriverInfo.car_details.model,
                year: reqDriverInfo.car_details.year,
                platno: reqDriverInfo.car_details.platno
            }
        }

        if (oldDriverInfo.UserType == 'Driver' && oldDriverInfo.LicenseNo == 'default') {
            newDriver.firstname = reqDriverInfo.firstname;
            newDriver.lastname = reqDriverInfo.lastname;
            newDriver.LicenseNo = reqDriverInfo.LicenseNo;
            newDriver.Age = reqDriverInfo.Age;
        }

        if (reqDriverInfo.AppointmentId) {
            newDriver.AppointmentId = reqDriverInfo.AppointmentId;
            const newAppointmentInfo = await AppointmentInfo.findById(reqDriverInfo.AppointmentId);
            req.session.appointmentInfo = newAppointmentInfo;
        }

        await DriverTestInfo.findByIdAndUpdate(_id, newDriver);

        const newDriverInfo = await DriverTestInfo.findById(_id);
        
        req.session.driverType = newDriverInfo.UserType;
        req.session.licenseNo = newDriverInfo.LicenseNo;
        req.session.driverInfo = newDriverInfo;

        console.log("G2 page end. newDriverInfo=" + newDriverInfo);
    } catch (error) {
        res.status(400).send('Error processing G2 page request');
        console.error('Error processing G2 page: ', error);
    }
    res.redirect('/');
};
