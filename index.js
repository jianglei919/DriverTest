const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = new express();
const ejs = require('ejs');

const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');

global.loggedIn = null;
global.isDriver = null;
global.isAdmin = null;
global.isExaminer = null;
global.isDefaultInfo = null;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  expressSession({
    secret: 'keyboard cat',
  })
);
app.use('*', (req, res, next) => {
  loggedIn = req.session.userId;
  isDriver = req.session.driverType == 'Driver';
  isAdmin = req.session.driverType == 'Admin';
  isExaminer = req.session.driverType == 'Examiner';
  isDefaultInfo = req.session.licenseNo == 'default';
  next();
});

const mongoose = require('mongoose');
mongoose.connect(
  'mongodb+srv://leighton:qwerty123456@cluster0.3vvnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
);

const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const g2Controller = require('./controllers/g2Controller');
const gController = require('./controllers/gController');
const adminController = require('./controllers/adminController');
const examinerController = require('./controllers/examinerController');

const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

//Home
app.get('/', homeController.routeHome);

//SignUp
app.get('/auth/signUp', redirectIfAuthenticatedMiddleware, userController.routeSignUp)
app.post('/user/signUp', redirectIfAuthenticatedMiddleware, userController.userSignUp);

// Login/Logout
app.get('/auth/login', redirectIfAuthenticatedMiddleware, userController.routeLogin);
app.get('/auth/logout', userController.logout);
app.post('/user/login', redirectIfAuthenticatedMiddleware, userController.userLogin);

// G2
app.get('/driver/g2', authMiddleware, g2Controller.routeG2);
app.post('/driver/g2/store', authMiddleware, g2Controller.g2Store);

// G
app.get('/driver/g', authMiddleware, gController.routeG);
app.post('/driver/g/store', authMiddleware, gController.gStore);

//Appointment
app.get('/admin/appointment', authMiddleware, adminController.routeAppointment);
app.get('/admin/appointment/retrieval', authMiddleware, adminController.retrievalAppointment);
app.post('/admin/appointment/add', authMiddleware, adminController.addAppointment);

//Candidate
app.get('/admin/candidate', authMiddleware, adminController.getCandidates);
app.post('/admin/createOrder', authMiddleware, adminController.createOrder);

//Examiner
app.get('/examiner', authMiddleware, examinerController.routeExaminer);
app.get('/examiner/driverInfo/retrieval', authMiddleware, examinerController.retrievalDriverInfo);
app.post('/examiner/driverInfo/update/:id', authMiddleware, examinerController.updateDriverInfo);

// notfound
app.use((req, res) => res.render('notFound'));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
