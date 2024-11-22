module.exports = (req, res) => {
    res.render('G2', { driverInfo: req.session.driverInfo, appointmentInfo: req.session.appointmentInfo });
};