const DriverTestInfo = require('../models/DriverTestInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        console.log("SignUp page start.");

        const newDriver = new DriverTestInfo(req.body);
        const saveResult = await DriverTestInfo.create(newDriver);

        console.log("Store User. saveResult=" + saveResult);
    } catch (error) {
        res.status(400).send('Error processing SignUp page request');
        console.error('Error processing SignUp page: ', error);
    }
    res.redirect('/');
};
