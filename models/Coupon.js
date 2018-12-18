const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CouponSchema = new Schema({


   detail: {
    type: Schema.Types.ObjectId,
    ref: 'details'
   },

   sponser: {
    type: Schema.Types.ObjectId,
    ref: 'sponsers'
   },

    qrKey: {
        type: String,
        default: "empty"
    },

    v_status: {
        type: String,
        default: "false"
    }
});

module.exports = mongoose.model('Coupon', CouponSchema);