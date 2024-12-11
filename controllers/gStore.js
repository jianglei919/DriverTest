const DriverTestInfo = require('../models/DriverTestInfo.js');
const AppointmentInfo = require('../models/AppointmentInfo.js');

module.exports = async (req, res) => {
    try {
        const _id = req.session.userId;
        console.log("G page start. _id=" + _id);

        // 获取旧的司机信息
        const oldDriverInfo = await DriverTestInfo.findById(_id);
        if (!oldDriverInfo) {
            console.log("G page not find by _id=" + _id);
            req.flash('validationErrors', ['Driver not found']);
            return res.redirect('/g');
        }

        // 如果是从 G2 升级到 G
        if (oldDriverInfo.TestType === 'G2') {
            console.log("Upgrading from G2 to G.");
        }

        // 获取请求中的新司机信息
        const reqDriverInfo = new DriverTestInfo(req.body);

        // 准备更新司机信息
        const newDriver = {
            car_details: {
                make: reqDriverInfo.car_details.make,
                model: reqDriverInfo.car_details.model,
                year: reqDriverInfo.car_details.year,
                platno: reqDriverInfo.car_details.platno
            },
            TestType: 'G', // 更新为 G 类型
        };

        // 更新预约信息
        if (reqDriverInfo.AppointmentId) {
            newDriver.AppointmentId = reqDriverInfo.AppointmentId;

            const newAppointmentInfo = await AppointmentInfo.findById(reqDriverInfo.AppointmentId);
            if (newAppointmentInfo) {
                newAppointmentInfo.isTimeSlotAvailable = false; // 新预约时间段不可用
                await newAppointmentInfo.save();
                req.session.appointmentInfo = newAppointmentInfo;
            }

            newDriver.TestResult = 'PENDING'; // 初始化测试结果为 PENDING
            newDriver.Comment = ''; // 清空注释
        }

        // 更新旧的预约时间段为可用
        if (oldDriverInfo.AppointmentId && oldDriverInfo.TestResult !== 'FAIL') {
            const oldAppointment = await AppointmentInfo.findById(oldDriverInfo.AppointmentId);
            if (oldAppointment) {
                oldAppointment.isTimeSlotAvailable = true; // 设置旧预约为可用
                await oldAppointment.save();
            }
        }

        // 更新司机信息
        await DriverTestInfo.findByIdAndUpdate(_id, newDriver);

        // 获取更新后的司机信息
        const newDriverInfo = await DriverTestInfo.findById(_id);

        // 更新 session 信息
        req.session.driverType = newDriverInfo.UserType;
        req.session.licenseNo = newDriverInfo.LicenseNo;
        req.session.driverInfo = newDriverInfo;

        console.log("G page end. newDriverInfo:", newDriverInfo);
        req.flash('success', 'Successfully updated driver info.');
    } catch (error) {
        console.error('Error processing G page:', error);
        req.flash('validationErrors', ['Error processing G page request.']);
    }

    // 重定向到 G 页面
    res.redirect('/g');
};