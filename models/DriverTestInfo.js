const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const DriverTestInfoSchema = new Schema({
  firstname: { type: String, default: 'default' },
  lastname: { type: String, default: 'default' },
  LicenseNo: { type: String, default: 'default' },
  Age: { type: String, default: '0' },
  Username: { type: String, required: [true,'Please provide username'] },
  Password: { type: String, required: [true,'Please provide password'] },
  UserType: { type: String, default: 'Driver' },
  AppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppointmentInfo',
  },
  car_details: {
    make: { type: String, default: 'default' },
    model: { type: String, default: 'default' },
    year: { type: String, default: '0' },
    platno: { type: String, default: 'default' },
  }
});

DriverTestInfoSchema.plugin(uniqueValidator);

DriverTestInfoSchema.pre('save', async function (next) {
  const driverInfo = this;

  const hash = await bcrypt.hash(driverInfo.Password, 10);

  driverInfo.Password = hash;

  next();
});

// export model
const DriverTestInfo = mongoose.model('DriverTestInfo', DriverTestInfoSchema);
module.exports = DriverTestInfo;
