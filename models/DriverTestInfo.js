const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const DriverTestInfoSchema = new Schema({
  firstname: { type: String, default: 'default' },
  lastname: { type: String, default: 'default' },
  LicenseNo: { type: String, default: 'default' },
  Age: { type: String, default: '0' },
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  UserType: { type: String, default: 'Driver' },
  car_details: {
    make: { type: String, default: 'default' },
    model: { type: String, default: 'default' },
    year: { type: String, default: '0' },
    platno: { type: String, default: 'default' },
  }
});

DriverTestInfoSchema.pre('save', async function (next) {
  const driverInfo = this;

  const hash = await bcrypt.hash(driverInfo.Password, 10);

  driverInfo.Password = hash;

  next();
});

// export model
const DriverTestInfo = mongoose.model('DriverTestInfo', DriverTestInfoSchema);
module.exports = DriverTestInfo;
