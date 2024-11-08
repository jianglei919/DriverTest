const DriverTestInfo = require('../models/DriverTestInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        console.log("G page start.");

        const { LicenseNo } = req.body;

        console.log("G page param= " + LicenseNo);

        const driverInfo = await DriverTestInfo.findOne({ LicenseNo: LicenseNo, _id: req.session.userId });
        if (!driverInfo) {
            req.session.licenseNo = driverInfo.LicenseNo;
            req.session.driverInfo = driverInfo;
        }
        res.render('G', { driverInfo: driverInfo, retrieval: true });

        console.log("G page end.");
        return;
    } catch (error) {
        res.status(400).send('Error processing G page request');
        console.error('Error processing G page: ', error);
    }
    res.redirect('/');
};
