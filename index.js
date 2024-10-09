const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const DriverTestInfo = require('./models/DriverTestInfo.js');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://leighton:qwerty123456@cluster0.3vvnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
);

const app = new express();
const ejs = require('ejs');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Index Page
app.get('/', (req, res) => {
  res.render('Index');
});

// Login Page
app.get('/login', (req, res) => {
  res.render('Login');
});
app.post('/login', async (req, res) => {
  try {
    console.log("Login page start.");

    const { firstname, lastname } = req.body;

    console.log("login page FirstName= " + firstname + ", LastName=" + lastname);

    const driver = await DriverTestInfo.findOne({ firstname: firstname, lastname: lastname });

    console.log("login page find driver info: " + driver);

    if (driver) {
      res.redirect('/g');
    } else {
      res.redirect('/g2');
    }

    console.log("Login page end.");
  } catch (error) {
    res.status(400).send('Error processing Login page request');
    console.error('Error processing Login page: ', error);
  }
});


// G Page: Fetch and Update Data
app.get('/g', (req, res) => {
  res.render('G', { driverInfo: null, notFound: false });
});
app.post('/g', async (req, res) => {
  try {
    console.log("G page start.");

    const { LicenseNo } = req.body;

    console.log("G page param= " + LicenseNo);

    const driverInfo = await DriverTestInfo.findOne({ LicenseNo: LicenseNo });
    if (!driverInfo) {
      return res.render('G', { driverInfo: null, notFound: true });
    }
    res.render('G', { driverInfo, notFound: false });

    console.log("G page end.");
  } catch (error) {
    res.status(400).send('Error processing G page request');
    console.error('Error processing G page: ', error);
  }
});
app.post('/g/update', async (req, res) => {
  try {
    console.log("G update page start.");

    const { licenseNumber, make, model, year, platno } = req.body;

    console.log("G update page licenseNumber=" + licenseNumber);

    const updateResult = await DriverTestInfo.updateOne({ LicenseNo: licenseNumber }, {
      '$set': {
        'car_details.make': make,
        'car_details.model': model,
        'car_details.year': year,
        'car_details.platno': platno
      }
    });

    res.redirect('/g');

    console.log("G update page end. updateResult=" + updateResult);
  } catch (error) {
    res.status(400).send('Error processing G page update request');
    console.error('Error processing G page update: ', error);
  }
});

// G2 Page
app.get('/g2', (req, res) => {
  res.render('G2');
});
app.post('/g2', async (req, res) => {
  try {
    console.log("G2 page start.");

    const newDriver = new DriverTestInfo(req.body);
    const saveResult = await newDriver.save();
    res.redirect('/g');

    console.log("G2 page end. saveResult=" + saveResult);
  } catch (error) {
    res.status(400).send('Error processing G2 page request');
    console.error('Error processing G2 page: ', error);
  }
});

app.listen(4000, () => {
  console.log('App listening on port 4000');
});
