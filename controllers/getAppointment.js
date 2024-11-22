const AppointmentInfo = require('../models/AppointmentInfo.js');
const path = require('path');

module.exports = async (req, res) => {
    const { date } = req.query;
    console.log("/get/appointment: " + date);
    try {
        const appointments = await AppointmentInfo.find({ date: date, isTimeSlotAvailable: true });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error fetching appointments.');
    }
};