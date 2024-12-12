module.exports = {
    routeHome: (req, res) => {
        console.log('Home page');
        res.render('home', {title: 'Welcom to home Page'});
    }
};