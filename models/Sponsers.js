const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SponserSchema = new Schema({


   file: {
    type: String
   },

    status: {
        type: Boolean,
        require: true
    },

    title: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        default: Date.now()
    },

    offer: {
        type: String
    },

    link:{
        type: String
    }

    // comments: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comments'
    // }] 
});

module.exports = mongoose.model('Sponser', SponserSchema);