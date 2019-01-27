const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({

    
    username: {
        type: String,
        default: 'empty'
    },

    password: {
        type: String,
        default: 'empty'
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