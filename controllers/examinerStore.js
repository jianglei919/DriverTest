const DriverTestInfo = require('../models/DriverTestInfo');

module.exports = async (req, res) => {
    try {
        const { id } = req.params;
        const { testResult, comment } = req.body;

        console.log('examiner store start. id=' + id + ', testResult=' + testResult + ', comment=' + comment);

        const oldDriverInfo = await DriverTestInfo.findById(id);

        if (!oldDriverInfo) {
            console.log("Driver not found by driverId=" + id);
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        const newDriver = {
            TestResult: testResult,
            Comment: comment
        }

        //如果Fail，清空预约记录
        if (testResult === 'FAIL') {
            newDriver.AppointmentId = null;
        }

        await DriverTestInfo.findByIdAndUpdate(id, newDriver);

        const newDriverInfo = await DriverTestInfo.findById(id);

        res.json({ success: true, updatedDriver: newDriverInfo });
        console.log('examiner store end.');
    } catch (error) {
        console.error('Error processing examiner page: ', error);
        res.status(500).json({ success: false, message: 'Error processing examiner page!' });
    }
};