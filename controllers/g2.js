module.exports = (req, res) => {
    let g2Passed = req.session.driverInfo.TestResult == 'PASS' && req.session.driverInfo.TestType == 'G2'
    const gPassed = req.session.driverInfo.TestResult == 'PASS' && req.session.driverInfo.TestType == 'G'
    g2Passed = gPassed ? true : g2Passed;
    console.log("G2 page router, g2Passed: " + g2Passed + ", gPassed: " + gPassed + ", TestType: " + req.session.driverInfo.TestType);
    res.render('G2', { 
        driverInfo: req.session.driverInfo, 
        appointmentInfo: req.session.appointmentInfo,
        g2Passed: g2Passed,
        gPassed: gPassed,
        errors: req.flash('validationErrors'),
        success: req.flash('success')
    });
};