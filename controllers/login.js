module.exports = (req, res) => {
    var username = '';
    const data = req.flash('data')[0];

    if (typeof data != "undefined") {
        username = data.Username;
    }
    res.render('Login', {
        errors: req.flash('validationErrors'),
        username: username,
    });
};