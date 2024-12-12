const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const DriverTestInfoSchema = new Schema({
  firstname: { type: String, default: 'default' },
  lastname: { type: String, default: 'default' },
  LicenseNo: { type: String, default: 'default', index: true }, // Indexed
  Age: { type: String, default: '0' },
  Username: { type: String, required: [true,'Please provide username'], unique: true, index: true }, // Unique and Indexed
  Password: { type: String, required: [true,'Please provide password'] },
  UserType: { type: String, default: 'Driver', index: true }, // Indexed for filtering by user type
  AppointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppointmentInfo',
  },
  car_details: {
    make: { type: String, default: 'default' },
    model: { type: String, default: 'default' },
    year: { type: String, default: '0' },
    platno: { type: String, default: 'default' },
  },
  TestType: { type: String, enum: ['G', 'G2'], default: 'G2', index: true }, // Indexed for filtering test type
  TestResult: { type: String, enum: ['PASS', 'FAIL', 'PENDING'], default: 'PENDING', index: true }, // Indexed for filtering test results
  Comment: { type: String, default: '' } // Examiner's comments
});

// Plugin for unique validation
DriverTestInfoSchema.plugin(uniqueValidator);

// Pre-save middleware to hash passwords
DriverTestInfoSchema.pre('save', async function (next) {
  const driverInfo = this;

  // Hash password before saving
  const hash = await bcrypt.hash(driverInfo.Password, 10);
  driverInfo.Password = hash;

  next();
});

// Compound index to optimize searches for drivers
DriverTestInfoSchema.index({ firstname: 1, lastname: 1 }); // Compound index for name searches
DriverTestInfoSchema.index({ LicenseNo: 1, UserType: 1 }); // Compound index for license and user type searches
DriverTestInfoSchema.index({ TestType: 1, TestResult: 1 }); // Compound index for test type and result

// Export model
const DriverTestInfo = mongoose.model('DriverTestInfo', DriverTestInfoSchema);
module.exports = DriverTestInfo;