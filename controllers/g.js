module.exports = (req, res) => {
    res.render('G', { driverInfo: req.session.driverInfo, retrieval: false });
};