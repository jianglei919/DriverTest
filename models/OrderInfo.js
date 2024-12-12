const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderInfoSchema = new Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'DriverTestInfo' },
    orderType: String, // E.g., 'Driver License'
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OrderInfo', OrderInfoSchema);