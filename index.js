const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

// App Initialization
const app = express();
const port = process.env.PORT || 4000;

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Flash messages
app.use(flash());

// Session management
app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);

// Globals
global.loggedIn = null;
global.isDriver = null;
global.isAdmin = null;
global.isExaminer = null;
global.isDefaultInfo = null;

// Middleware for setting global variables
app.use('*', (req, res, next) => {
  loggedIn = req.session.userId;
  isDriver = req.session.driverType === 'Driver';
  isAdmin = req.session.driverType === 'Admin';
  isExaminer = req.session.driverType === 'Examiner';
  isDefaultInfo = req.session.licenseNo === 'default';
  next();
});

// MongoDB Connection
mongoose.connect(
  'mongodb+srv://leighton:qwerty123456@cluster0.3vvnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Import Routes
const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const g2Routes = require('./routes/g2Routes');
const gRoutes = require('./routes/gRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examinerRoutes = require('./routes/examinerRoutes');

// Route Handlers
app.use('/', homeRoutes);
app.use('/auth', userRoutes);
app.use('/driver/g2', g2Routes);
app.use('/driver/g', gRoutes);
app.use('/admin', adminRoutes);
app.use('/examiner', examinerRoutes);

// Handle 404 Errors
app.use((req, res) => res.status(404).render('notFound'));

// Start the Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Views path:', app.get('views'));
  console.log('__dirname:', __dirname);
  console.log('Views directory exists?', fs.existsSync(path.join(__dirname, 'views')));
});