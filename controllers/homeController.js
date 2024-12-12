module.exports = {
    routeHome: (req, res) => {
        console.log('Home page');
        const driverInfo = req.session.driverInfo;
        let userName = "to home Page";
        if (driverInfo) {
            if (driverInfo.UserType === 'Driver' && driverInfo.LicenseNo !== 'default') {
                userName = driverInfo.firstname + " " + driverInfo.lastname;
            } else if (driverInfo.UserType === 'Admin') {
                userName = 'Admin';
            } else if (driverInfo.UserType === 'Examiner') {
                userName = 'Examiner';
            }
        }
        res.render('home', {title: `Welcom ${userName}`});
    }
};