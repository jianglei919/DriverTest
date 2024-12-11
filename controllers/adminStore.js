const AppointmentInfo = require('../models/AppointmentInfo.js');

// module.exports = async (req, res) => {
//     try {
//         console.log("Admin page start.");
//         const { date, time } = req.body;
        
//         req.flash('data', req.body);

//         //checked date & time unique
//         const existingAppointment = await AppointmentInfo.findOne({ date, time });
//         if (existingAppointment) {
//             req.flash('validationErrors', [`Time slot already exists for date: ${date}, time: ${time}`]);            
//             return res.redirect('/admin');
//         }

//         const newAppointment = new AppointmentInfo(req.body);
//         newAppointment.isTimeSlotAvailable = true;

//         const saveResult = await AppointmentInfo.create(newAppointment);

//         console.log("Store Appointment. saveResult=" + saveResult);
//         req.flash('success', 'Successfully');
//     } catch (error) {
//         console.log('admin error: ', error);
//         if (error.code === 11000) {
//             const duplicateKey = JSON.stringify(error.keyValue);
//             req.flash('validationErrors', [`Duplicate entry detected: ${duplicateKey}`]);
//         } else {
//             const validationErrors = Object.keys(error.errors || {}).map(
//                 (key) => error.errors[key]?.message || 'Unknown error'
//             );
//             req.flash('validationErrors', validationErrors);
//         }
//     }
//     return res.redirect('/admin');
// };

module.exports = async (req, res) => {
    try {
        console.log("Admin page start.");
        const { date, time } = req.body;

        // 检查是否已存在
        const existingAppointment = await AppointmentInfo.findOne({ date, time });
        if (existingAppointment) {
            return res.json({ success: false, message: `Time slot already exists for date: ${date}, time: ${time}` });
        }

        // 添加新 time-slot
        const newAppointment = new AppointmentInfo({
            date,
            time,
            isTimeSlotAvailable: true,
        });

        await newAppointment.save();

        res.json({ success: true, message: 'Time-slot added successfully!' });
    } catch (error) {
        console.error('Error adding time-slot:', error);
        res.status(500).json({ success: false, message: 'Error adding time-slot.' });
    }
};
