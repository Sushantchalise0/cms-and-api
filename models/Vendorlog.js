const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorlogSchema = new Schema({

    
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendors'
    },

    username: {
        type: String,
        default: 'empty'
    },

    password: {
        type: String,
        default: 'empty'
    }
});

module.exports = mongoose.model('Vendorlog', VendorlogSchema);