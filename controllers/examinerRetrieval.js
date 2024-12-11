const { stringify } = require('querystring');
const DriverTestInfo = require('../models/DriverTestInfo');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const { TestType, driverName, LicenseNo } = req.query;
        const query = {};

        query.UserType = 'Driver';

        if (TestType) {
            query.TestType = TestType;
        }

        if (driverName) {
            const [firstname, lastname] = driverName.split(' ');
            if (firstname) {
                query.firstname = { $regex: firstname, $options: 'i' };
            }
            if (lastname) {
                query.lastname = { $regex: lastname, $options: 'i' };
            }
        }
        if (LicenseNo) {
            query.LicenseNo = LicenseNo;
        }

        console.log('examiner retrieval start. param: ' + JSON.stringify(query));

        const driverInfos = await DriverTestInfo.find(query);
        res.json({ success: true, driverInfos });
        console.log('examiner retrieval end.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};