const AppointmentInfo = require('../models/AppointmentInfo.js');
const DriverTestInfo = require('../models/DriverTestInfo.js');
const OrderInfo = require('../models/OrderInfo.js');

module.exports = {
    //路由到预约页面
    routeAppointment: (req, res) => {
        if (req.session.driverInfo?.UserType !== 'Admin') {
            return res.redirect('/');
        }
        var date = '';
        var time = '';
        const data = req.flash('data')[0];

        if (typeof data != "undefined") {
            date = data.date;
            time = data.time;
            console.log('Appointment request param: ', { date, time });
        }

        res.render('adminAppointment', {
            date: date,
            time: time,
            errors: req.flash('validationErrors'),
            success: req.flash('success')
        });
    },

    //查询预约信息
    retrievalAppointment: async (req, res) => {
        try {
            console.log("Get appointment page start.");
            const { date } = req.query;
            const appointments = await AppointmentInfo.find({ date: date });
            res.json(appointments);
            console.log("Get appointment page end.");
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).send('Error fetching appointments.');
        }
    },

    //添加预约信息
    addAppointment: async (req, res) => {
        try {
            console.log("Add appointment page start.");
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
    },

    // 获取候选人列表
    getCandidates: async (req, res) => {
        try {
            // 查询所有候选人，并排除 LicenseNo 为 'default' 的候选人
            const candidates = await DriverTestInfo.find({ UserType: 'Driver', LicenseNo: { $ne: 'default' } });

            // 查询所有订单，避免重复创建订单
            const orders = await OrderInfo.find();
            const orderedCandidateIds = orders.map(order => order.candidateId.toString());

            // 将订单状态附加到候选人信息
            const candidatesWithOrderStatus = candidates.map(candidate => ({
                ...candidate.toObject(),
                hasOrder: orderedCandidateIds.includes(candidate._id.toString()),
            }));

            res.render('adminCandidate', {
                candidates: candidatesWithOrderStatus,
                success: req.flash('success'),
                errors: req.flash('validationErrors'),
            });
        } catch (error) {
            console.error('Error fetching candidates:', error);
            req.flash('validationErrors', ['Error fetching candidates']);
            res.redirect('/admin/candidate');
        }
    },

    // 创建订单
    createOrder: async (req, res) => {
        try {
            const { candidateId } = req.body;
            const candidate = await DriverTestInfo.findById(candidateId);

            if (!candidate || candidate.TestResult !== 'PASS') {
                req.flash('validationErrors', ['Invalid candidate or candidate not passed']);
                return res.redirect('/admin/candidate');
            }

            // 检查是否已存在订单
            const existingOrder = await OrderInfo.findOne({ candidateId });
            if (existingOrder) {
                req.flash('validationErrors', ['Order already exists for this candidate']);
                return res.redirect('/admin/candidate');
            }

            // 创建新订单
            const order = new OrderInfo({ candidateId, orderType: 'Driver License' });
            await order.save();

            req.flash('success', `Order created for ${candidate.firstname} ${candidate.lastname}`);
        } catch (error) {
            console.error('Error creating order:', error);
            req.flash('validationErrors', ['Error creating order']);
        }
        res.redirect('/admin/candidate');
    },
};
