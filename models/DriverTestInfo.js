const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DriverTestInfoSchema = new Schema({
  firstname: String,
  lastname: String,
  LicenseNo: { type: String, unique: true },
  Age: String,
  car_details: {
    make: String,
    model: String,
    year: String,
    platno: String
  }
});

const DriverTestInfo = mongoose.model('DriverTestInfo', DriverTestInfoSchema);

module.exports = DriverTestInfo;
