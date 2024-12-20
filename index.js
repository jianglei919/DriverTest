const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const mongoStore = require('connect-mongo');
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

// Configure session store
app.use(
  expressSession({
    secret: 'keyboard cat', // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: 'mongodb+srv://leighton:qwerty123456@cluster0.3vvnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Globals
global.loggedIn = null;
global.isDefaultInfo = null;
global.userType = 'Driver';

// Middleware for setting global variables
app.use('*', (req, res, next) => {
  loggedIn = req.session.userId;
  userType = req.session.driverInfo?.UserType;
  isDefaultInfo = req.session.driverInfo?.LicenseNo === 'default';
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
app.use((req, res) => {
  console.error(`404 Error: ${req.url} not found`);
  res.status(404).render('notFound');
});

// Start the Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});