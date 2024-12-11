module.exports = (req, res) => {
    const isFinalStatus = req.session.driverInfo.TestResult == 'PASS' && req.session.driverInfo.TestType == 'G'
    if (isDefaultInfo) {
        res.render('G2', { 
            driverInfo: req.session.driverInfo, 
            appointmentInfo: req.session.appointmentInfo,
            isFinalStatus: isFinalStatus,
            errors: req.flash('validationErrors'),
            success: req.flash('success')
        });
    } else {
        res.render('G', { 
            driverInfo: req.session.driverInfo, 
            appointmentInfo: req.session.appointmentInfo,
            isFinalStatus: isFinalStatus,
            errors: req.flash('validationErrors'),
            success: req.flash('success')
        });
    }
};