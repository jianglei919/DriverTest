const AppointmentInfo = require('../models/AppointmentInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const { date } = req.query;
        console.log("/get/appointment: " + date);
        const appointments = await AppointmentInfo.find({ date: date });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments.');
    }
};