const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    vendor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Vendors'
    },
    name: {
        type: String,
        default: 'empty'
    },

    img:{
        type: String,
        default: 'empty'
    },
    coins:{
        type: String,
        default: 'empty'
    },
    desc:{
        type: String,
        default: 'empty'
    },
    date:{
        type: Date,
        default: Date.now()
    },
    act_price:{
        type: String,
        default: 'empty'
    },
    disc_price:{
        type: String,
        default: 'empty'
    },
    status:{
        type: String,
        default: false
    }
});

module.exports = mongoose.model('Products', ProductSchema);