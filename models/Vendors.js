const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    cat_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    vendor_ic: {
        type: String,
        default: 'empty'
    },

    vendor_name:{
        type: String,
        default: 'empty'
    },
    vendor_address:{
        type: String,
        default: 'empty'
    },
    status:{
        type: String,
        default: false
    }
});

module.exports = mongoose.model('Vendors', VendorSchema);