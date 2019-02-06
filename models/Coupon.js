const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CouponSchema = new Schema({


   detail: {
    type: Schema.Types.ObjectId,
    ref: 'details'
   },
   productID: {
    type: Schema.Types.ObjectId,
    ref: 'Products'
   },
   vendorID: {
    type: Schema.Types.ObjectId,
    ref: 'Vendors'
   },
    qrKey: {
        type: String,
        default: "empty"
    },
    v_status: {
        type: String,
        default: "false"
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    redeemed_date: {
        type: Date,
        default: "0001-01-01"
    },
});

module.exports = mongoose.model('Coupon', CouponSchema);