const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const app = new express();
const ejs = require('ejs');

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


const homeController = require('./controllers/home');

const signUpUserController = require('./controllers/signUp');
const storeUserController = require('./controllers/storeUser');

const loginController = require('./controllers/login');
const logoutController = require('./controllers/logout');
const userLoginController = require('./controllers/userLogin');

const g2Controller = require('./controllers/g2');
const g2StoreController = require('./controllers/g2Store');

const gController = require('./controllers/g');
const gStoreController = require('./controllers/gStore');

const adminController = require('./controllers/admin');
const adminStoreController = require('./controllers/adminStore');

const appointmentController = require('./controllers/getAppointment');

const examinerController = require('./controllers/examiner');
const examinerRetrievalController = require('./controllers/examinerRetrieval');
const examinerStoreController = require('./controllers/examinerStore');

const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

//Home
app.get('/', homeController);

//SignUp
app.get('/auth/signUp', redirectIfAuthenticatedMiddleware, signUpUserController)
app.post('/user/signUp', redirectIfAuthenticatedMiddleware, storeUserController);

// Login/Logout
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.get('/auth/logout', logoutController);
app.post('/user/login', redirectIfAuthenticatedMiddleware, userLoginController);

// G2
app.get('/g2', authMiddleware, g2Controller);
app.post('/g2/store', authMiddleware, g2StoreController);

// G
app.get('/g', authMiddleware, gController);
app.post('/g/store', authMiddleware, gStoreController);

//admin
app.get('/admin', authMiddleware, adminController);
app.post('/admin/store', authMiddleware, adminStoreController);

//appointment
app.get('/get/appointment', authMiddleware, appointmentController);

//examiner
app.get('/examiner', authMiddleware, examinerController)
app.get('/examiner/retrieval', authMiddleware, examinerRetrievalController);
app.post('/examiner/store/:id', authMiddleware, examinerStoreController);

// notfound
app.use((req, res) => res.render('Notfound'));

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
