module.exports = (req, res) => {
    var date = '';
    var time = '';
    const data = req.flash('data')[0];

    if (typeof data != "undefined") {
        date = data.date;
        time = data.time;
        console.log('admin request param: ', { date, time });
    }

    res.render('Admin', {
        date: date,
        time: time,
        errors: req.flash('validationErrors'),
        success: req.flash('success')
    });
};