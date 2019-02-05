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
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Coupon', CouponSchema);