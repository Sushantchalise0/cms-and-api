const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SponserSchema = new Schema({


   file: {
    type: String,
    default: 'empty'
   },

    status: {
        type: String,
        default: false
    },

    title: {
        type: String,
        default: 'empty'
    },

    description: {
        type: String,   
        default: 'empty'
    },

    date: {
        type: Date,
        default: Date.now()
    },

    offer: {
        type: String,
        default: 'empty'
    },

    coins: {
        type: Number,
        default: 0
    }

    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comments'
    // }] 
});

module.exports = mongoose.model('sponsers', SponserSchema);