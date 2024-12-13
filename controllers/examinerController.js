const DriverTestInfo = require('../models/DriverTestInfo');

module.exports = {
    //route to the Examiner.ejs page
    routeExaminer: (req, res) => {
        if (req.session.driverInfo?.UserType !== 'Examiner') {
            return res.redirect('/');
        }
        const data = req.flash('data')[0];
        const testResult = data?.testResult || '';
        const comment = data?.comment || '';

        res.render('examiner', {
            testResult: testResult,
            comment: comment,
            errors: req.flash('validationErrors'),
            success: req.flash('success'),
        });
    },

    // retrieval driverInfos
    retrievalDriverInfo: async (req, res) => {
        try {
            const { TestType, driverName, LicenseNo } = req.query;
            const query = {};

            query.UserType = 'Driver';
            query.LicenseNo = { $ne: 'default' }; // 排除 LicenseNo 为 'default' 的候选人

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

            if (LicenseNo && LicenseNo !== 'default') {
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
    },

    //updated driver info
    updateDriverInfo: async (req, res) => {
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
    }
};