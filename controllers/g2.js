module.exports = (req, res) => {
    const isFinalStatus = req.session.driverInfo.TestResult == 'PASS' && req.session.driverInfo.TestType == 'G'
    res.render('G2', { 
        driverInfo: req.session.driverInfo, 
        appointmentInfo: req.session.appointmentInfo,
        isFinalStatus: isFinalStatus,
        errors: req.flash('validationErrors'),
        success: req.flash('success')
    });
};