module.exports = (req, res) => {
    const data = req.flash('data')[0];
    const testResult = data?.testResult || ''; 
    const comment = data?.comment || '';

    res.render('Examiner', {
        testResult: testResult,
        comment: comment,
        errors: req.flash('validationErrors'),
        success: req.flash('success'),
    });
};