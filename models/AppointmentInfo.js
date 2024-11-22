const mongoose = require('mongoose');

const AppointmentInfoSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    isTimeSlotAvailable: { type: Boolean, default: true }
});

AppointmentInfoSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('AppointmentInfo', AppointmentInfoSchema);